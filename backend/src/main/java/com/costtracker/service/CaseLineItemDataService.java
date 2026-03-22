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
import java.math.RoundingMode;
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
     * Computes $/Unit and $/Sq.Feet from amount, numberOfUnits, and totalSqFeet.
     */
    public List<CaseLineItemDataDTO> getLineItemDataByCaseId(Integer caseId,
                                                              Integer numberOfUnits,
                                                              Integer totalSqFeet) {
        if (!caseRepository.existsById(caseId)) {
            throw new ResourceNotFoundException("Case not found with ID: " + caseId);
        }

        String sql = """
                SELECT li.line_item_id, li.group_name, li.line_item_name,
                       cld.amount, cld.comments
                FROM line_items li
                LEFT JOIN case_line_item_data cld
                    ON li.line_item_id = cld.line_item_id AND cld.case_id = ?
                ORDER BY li.line_item_id
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) -> {
            CaseLineItemDataDTO dto = new CaseLineItemDataDTO();
            dto.setLineItemId(rs.getInt("line_item_id"));
            dto.setGroupName(rs.getString("group_name"));
            dto.setLineItemName(rs.getString("line_item_name"));

            BigDecimal amount = rs.getBigDecimal("amount");
            dto.setAmount(amount);

            dto.setUnitAmount(computeUnitAmount(amount, numberOfUnits));
            dto.setPerSqft(computePerSqft(amount, totalSqFeet));

            dto.setComments(rs.getString("comments"));
            return dto;
        }, caseId);
    }

    /**
     * Updates a single line item data entry for a given case.
     * Only saves amount and comments. $/Unit and $/Sq.Feet are computed.
     */
    @Transactional
    public CaseLineItemDataDTO updateLineItemData(Integer caseId,
                                                   CaseLineItemUpdateDTO updateDTO,
                                                   Integer numberOfUnits,
                                                   Integer totalSqFeet) {
        if (!caseRepository.existsById(caseId)) {
            throw new ResourceNotFoundException("Case not found with ID: " + caseId);
        }

        if (!lineItemRepository.existsById(updateDTO.getLineItemId())) {
            throw new ResourceNotFoundException("Line item not found with ID: " + updateDTO.getLineItemId());
        }

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
        data.setComments(updateDTO.getComments());

        CaseLineItemData saved = caseLineItemDataRepository.save(data);

        String lineItemName = lineItemRepository.findById(saved.getLineItemId())
                .map(li -> li.getLineItemName())
                .orElse("");
        String groupName = lineItemRepository.findById(saved.getLineItemId())
                .map(li -> li.getGroupName())
                .orElse("");

        return new CaseLineItemDataDTO(
                saved.getLineItemId(),
                groupName,
                lineItemName,
                saved.getAmount(),
                computeUnitAmount(saved.getAmount(), numberOfUnits),
                computePerSqft(saved.getAmount(), totalSqFeet),
                saved.getComments()
        );
    }

    /**
     * Batch update all line items for a given case.
     */
    @Transactional
    public List<CaseLineItemDataDTO> updateAllLineItemData(Integer caseId,
                                                            List<CaseLineItemUpdateDTO> updates,
                                                            Integer numberOfUnits,
                                                            Integer totalSqFeet) {
        return updates.stream()
                .map(update -> updateLineItemData(caseId, update, numberOfUnits, totalSqFeet))
                .collect(Collectors.toList());
    }

    private BigDecimal computeUnitAmount(BigDecimal amount, Integer numberOfUnits) {
        if (amount == null || numberOfUnits == null || numberOfUnits == 0) {
            return null;
        }
        return amount.divide(BigDecimal.valueOf(numberOfUnits), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal computePerSqft(BigDecimal amount, Integer totalSqFeet) {
        if (amount == null || totalSqFeet == null || totalSqFeet == 0) {
            return null;
        }
        return amount.divide(BigDecimal.valueOf(totalSqFeet), 2, RoundingMode.HALF_UP);
    }

    private void validateAmounts(CaseLineItemUpdateDTO dto) {
        if (dto.getAmount() != null && dto.getAmount().compareTo(new BigDecimal("10000000")) > 0) {
            throw new BadRequestException("Amount must not exceed 10,000,000");
        }
    }
}
