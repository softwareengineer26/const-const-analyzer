package com.costtracker.controller;

import com.costtracker.dto.CaseLineItemDataDTO;
import com.costtracker.dto.CaseLineItemUpdateDTO;
import com.costtracker.service.CaseLineItemDataService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cases/{caseId}/line-items")
public class CaseLineItemDataController {

    private final CaseLineItemDataService caseLineItemDataService;

    public CaseLineItemDataController(CaseLineItemDataService caseLineItemDataService) {
        this.caseLineItemDataService = caseLineItemDataService;
    }

    @GetMapping
    public ResponseEntity<List<CaseLineItemDataDTO>> getLineItemData(@PathVariable Integer caseId) {
        return ResponseEntity.ok(caseLineItemDataService.getLineItemDataByCaseId(caseId));
    }

    @PutMapping("/{lineItemId}")
    public ResponseEntity<CaseLineItemDataDTO> updateLineItemData(
            @PathVariable Integer caseId,
            @PathVariable Integer lineItemId,
            @Valid @RequestBody CaseLineItemUpdateDTO updateDTO) {
        updateDTO.setLineItemId(lineItemId);
        return ResponseEntity.ok(caseLineItemDataService.updateLineItemData(caseId, updateDTO));
    }

    @PutMapping
    public ResponseEntity<List<CaseLineItemDataDTO>> updateAllLineItemData(
            @PathVariable Integer caseId,
            @Valid @RequestBody List<CaseLineItemUpdateDTO> updates) {
        return ResponseEntity.ok(caseLineItemDataService.updateAllLineItemData(caseId, updates));
    }
}
