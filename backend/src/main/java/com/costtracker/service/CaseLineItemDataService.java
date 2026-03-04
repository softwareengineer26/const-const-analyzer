package com.costtracker.service;

import com.costtracker.dto.CaseLineItemDataDTO;
import com.costtracker.dto.CaseLineItemUpdateDTO;
import com.costtracker.entity.CaseLineItemData;
import com.costtracker.exception.BadRequestException;
import com.costtracker.exception.ResourceNotFoundException;
import com.costtracker.repository.CaseLineItemDataRepository;
import com.costtracker.repository.CaseRepository;
import com.costtracker.repository.LineItemRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaseLineItemDataService {

    private final CaseLineItemDataRepository caseLineItemDataRepository;
    private final CaseRepository caseRepository;
    private final LineItemRepository lineItemRepository;
    private final JdbcTemplate jdbcTemplate;

    public CaseLineItemDataService(CaseLineItemDataRepository caseLineItemDataRepository,
                                    CaseRepository caseRepository,
                                    LineItemRepository lineItemRepository,
                                    JdbcTemplate jdbcTemplate) {
        this.caseLineItemDataRepository = caseLineItemDataRepository;
        this.caseRepository = caseRepository;
        this.lineItemRepository = lineItemRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Retrieves all line item data for a given case using Spring JDBC Template.
     * Demonstrates usage of JDBC Template alongside JPA.
     */
    public List<CaseLineItemDataDTO> getLineItemDataByCaseId(Integer caseId) {
        // Verify case exists
        if (!caseRepository.existsById(caseId)) {
            throw new ResourceNotFoundException("Case not found with ID: " + caseId);
        }

        String sql = """
                SELECT li.line_item_id, li.line_item_name,
                       cld.amount, cld.unit_amount, cld.per_sqft, cld.comments
                FROM line_items li
                LEFT JOIN case_line_item_data cld
                    ON li.line_item_id = cld.line_item_id AND cld.case_id = ?
                ORDER BY li.line_item_id
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            CaseLineItemDataDTO dto = new CaseLineItemDataDTO();
            dto.setLineItemId(rs.getInt("line_item_id"));
            dto.setLineItemName(rs.getString("line_item_name"));

            BigDecimal amount = rs.getBigDecimal("amount");
            dto.setAmount(amount);

            BigDecimal unitAmount = rs.getBigDecimal("unit_amount");
            dto.setUnitAmount(unitAmount);

            BigDecimal perSqft = rs.getBigDecimal("per_sqft");
            dto.setPerSqft(perSqft);

            dto.setComments(rs.getString("comments"));
            return dto;
        }, caseId);
    }

    /**
     * Updates a single line item data entry for a given case.
     * Uses JPA for the update operation.
     */
    @Transactional
    public CaseLineItemDataDTO updateLineItemData(Integer caseId, CaseLineItemUpdateDTO updateDTO) {
        // Validate case exists
        if (!caseRepository.existsById(caseId)) {
            throw new ResourceNotFoundException("Case not found with ID: " + caseId);
        }

        // Validate line item exists
        if (!lineItemRepository.existsById(updateDTO.getLineItemId())) {
            throw new ResourceNotFoundException("Line item not found with ID: " + updateDTO.getLineItemId());
        }

        // Validate amount constraints
        validateAmounts(updateDTO);

        CaseLineItemData data = caseLineItemDataRepository
                .findByCaseIdAndLineItemId(caseId, updateDTO.getLineItemId())
                .orElseGet(() -> {
                    CaseLineItemData newData = new CaseLineItemData();
                    newData.setCaseId(caseId);
                    newData.setLineItemId(updateDTO.getLineItemId());
                    return newData;
                });

        data.setAmount(updateDTO.getAmount());
        data.setUnitAmount(updateDTO.getUnitAmount());
        data.setPerSqft(updateDTO.getPerSqft());
        data.setComments(updateDTO.getComments());

        CaseLineItemData saved = caseLineItemDataRepository.save(data);

        // Fetch line item name for DTO
        String lineItemName = lineItemRepository.findById(saved.getLineItemId())
                .map(li -> li.getLineItemName())
                .orElse("");

        return new CaseLineItemDataDTO(
                saved.getLineItemId(),
                lineItemName,
                saved.getAmount(),
                saved.getUnitAmount(),
                saved.getPerSqft(),
                saved.getComments()
        );
    }

    /**
     * Batch update all line items for a given case.
     */
    @Transactional
    public List<CaseLineItemDataDTO> updateAllLineItemData(Integer caseId, List<CaseLineItemUpdateDTO> updates) {
        return updates.stream()
                .map(update -> updateLineItemData(caseId, update))
                .collect(Collectors.toList());
    }

    private void validateAmounts(CaseLineItemUpdateDTO dto) {
        if (dto.getAmount() != null && dto.getAmount().compareTo(new BigDecimal("10000000")) > 0) {
            throw new BadRequestException("Amount must not exceed 10,000,000");
        }
        if (dto.getUnitAmount() != null && dto.getUnitAmount().compareTo(new BigDecimal("10000000")) > 0) {
            throw new BadRequestException("Unit amount must not exceed 10,000,000");
        }
        if (dto.getPerSqft() != null && dto.getPerSqft().compareTo(new BigDecimal("1000")) > 0) {
            throw new BadRequestException("Per sq.ft. must not exceed 1,000");
        }
    }
}
