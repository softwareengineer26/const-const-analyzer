package com.costtracker.controller;

import com.costtracker.dto.CaseDTO;
import com.costtracker.service.CaseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/cases")
public class CaseController {

    private final CaseService caseService;

    public CaseController(CaseService caseService) {
        this.caseService = caseService;
    }

    @GetMapping
    public ResponseEntity<List<CaseDTO>> getAllCases() {
        return ResponseEntity.ok(caseService.getAllCases());
    }

    @GetMapping("/{caseId}")
    public ResponseEntity<CaseDTO> getCaseById(@PathVariable Integer caseId) {
        return ResponseEntity.ok(caseService.getCaseById(caseId));
    }

    @PostMapping
    public ResponseEntity<CaseDTO> createCase(@RequestBody CaseDTO caseDTO) {
        CaseDTO created = caseService.createCase(caseDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }
}
