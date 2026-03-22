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
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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
     * Retrieves all line item data for a given case, combining Estimate 1 and Estimate 2 into a single DTO per line item.
     */
    public List<CaseLineItemDataDTO> getLineItemDataByCaseId(Integer caseId,
                                                              Integer numberOfUnits,
                                                              Integer totalSqFeet) {
        if (!caseRepository.existsById(caseId)) {
            throw new ResourceNotFoundException("Case not found with ID: " + caseId);
        }

        String sql = """
                SELECT li.line_item_id, li.group_name, li.line_item_name,
                       cld.estimate_id, cld.amount, cld.comments
                FROM line_items li
                LEFT JOIN case_line_item_data cld
                    ON li.line_item_id = cld.line_item_id AND cld.case_id = ?
                ORDER BY li.line_item_id, cld.estimate_id
                """;

        Map<Integer, CaseLineItemDataDTO> dtoMap = new LinkedHashMap<>();

        jdbcTemplate.query(sql, (rs) -> {
            int lineItemId = rs.getInt("line_item_id");

            CaseLineItemDataDTO dto = dtoMap.computeIfAbsent(lineItemId, k -> {
                CaseLineItemDataDTO newDto = new CaseLineItemDataDTO();
                try {
                    newDto.setLineItemId(lineItemId);
                    newDto.setGroupName(rs.getString("group_name"));
                    newDto.setLineItemName(rs.getString("line_item_name"));
                } catch (java.sql.SQLException e) {
                    throw new RuntimeException(e);
                }
                return newDto;
            });

            Integer estimateId = rs.getObject("estimate_id") != null ? rs.getInt("estimate_id") : null;
            if (estimateId == null) {
                return;
            }

            BigDecimal amount = rs.getBigDecimal("amount");
            String comments = rs.getString("comments");

            if (estimateId == 1) {
                dto.setEst1Amount(amount);
                dto.setEst1UnitAmount(computeUnitAmount(amount, numberOfUnits));
                dto.setEst1PerSqft(computePerSqft(amount, totalSqFeet));
                dto.setEst1Comments(comments);
            } else if (estimateId == 2) {
                dto.setEst2Amount(amount);
                dto.setEst2UnitAmount(computeUnitAmount(amount, numberOfUnits));
                dto.setEst2PerSqft(computePerSqft(amount, totalSqFeet));
                dto.setEst2Comments(comments);
            }
        }, caseId);

        return dtoMap.values().stream().collect(Collectors.toList());
    }

    /**
     * Updates a single line item data entry for a given case and estimate.
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

        Integer estimateId = updateDTO.getEstimateId() != null ? updateDTO.getEstimateId() : 1;

        CaseLineItemData data = caseLineItemDataRepository
                .findByCaseIdAndLineItemIdAndEstimateId(caseId, updateDTO.getLineItemId(), estimateId)
                .orElseGet(() -> {
                    CaseLineItemData newData = new CaseLineItemData();
                    newData.setCaseId(caseId);
                    newData.setLineItemId(updateDTO.getLineItemId());
                    newData.setEstimateId(estimateId);
                    return newData;
                });

        data.setAmount(updateDTO.getAmount());
        data.setComments(updateDTO.getComments());

        caseLineItemDataRepository.save(data);

        // Return the combined DTO for this line item
        return getLineItemDataByCaseId(caseId, numberOfUnits, totalSqFeet).stream()
                .filter(dto -> dto.getLineItemId().equals(updateDTO.getLineItemId()))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Line item not found after save"));
    }

    /**
     * Batch update all line items for a given case.
     */
    @Transactional
    public List<CaseLineItemDataDTO> updateAllLineItemData(Integer caseId,
                                                            List<CaseLineItemUpdateDTO> updates,
                                                            Integer numberOfUnits,
                                                            Integer totalSqFeet) {
        if (!caseRepository.existsById(caseId)) {
            throw new ResourceNotFoundException("Case not found with ID: " + caseId);
        }

        for (CaseLineItemUpdateDTO updateDTO : updates) {
            if (!lineItemRepository.existsById(updateDTO.getLineItemId())) {
                throw new ResourceNotFoundException("Line item not found with ID: " + updateDTO.getLineItemId());
            }
            validateAmounts(updateDTO);

            Integer estimateId = updateDTO.getEstimateId() != null ? updateDTO.getEstimateId() : 1;

            CaseLineItemData data = caseLineItemDataRepository
                    .findByCaseIdAndLineItemIdAndEstimateId(caseId, updateDTO.getLineItemId(), estimateId)
                    .orElseGet(() -> {
                        CaseLineItemData newData = new CaseLineItemData();
                        newData.setCaseId(caseId);
                        newData.setLineItemId(updateDTO.getLineItemId());
                        newData.setEstimateId(estimateId);
                        return newData;
                    });

            data.setAmount(updateDTO.getAmount());
            data.setComments(updateDTO.getComments());
            caseLineItemDataRepository.save(data);
        }

        return getLineItemDataByCaseId(caseId, numberOfUnits, totalSqFeet);
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
