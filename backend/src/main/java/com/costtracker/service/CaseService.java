package com.costtracker.service;

import com.costtracker.dto.CaseDTO;
import com.costtracker.entity.Case;
import com.costtracker.exception.ResourceNotFoundException;
import com.costtracker.repository.CaseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CaseService {

    private final CaseRepository caseRepository;

    public CaseService(CaseRepository caseRepository) {
        this.caseRepository = caseRepository;
    }

    public List<CaseDTO> getAllCases() {
        return caseRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public CaseDTO getCaseById(Integer caseId) {
        Case caseEntity = caseRepository.findById(caseId)
                .orElseThrow(() -> new ResourceNotFoundException("Case not found with ID: " + caseId));
        return toDTO(caseEntity);
    }

    public CaseDTO createCase(CaseDTO caseDTO) {
        Case caseEntity = new Case();
        caseEntity.setCaseName(caseDTO.getCaseName());
        caseEntity.setCaseContact(caseDTO.getCaseContact());
        Case saved = caseRepository.save(caseEntity);
        return toDTO(saved);
    }

    private CaseDTO toDTO(Case entity) {
        return new CaseDTO(entity.getCaseId(), entity.getCaseName(), entity.getCaseContact());
    }
}
