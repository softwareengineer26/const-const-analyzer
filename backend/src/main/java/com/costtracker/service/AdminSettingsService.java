package com.costtracker.service;

import com.costtracker.dto.AdminSettingsDTO;
import com.costtracker.entity.AdminSettings;
import com.costtracker.exception.ResourceNotFoundException;
import com.costtracker.repository.AdminSettingsRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminSettingsService {

    private final AdminSettingsRepository adminSettingsRepository;

    public AdminSettingsService(AdminSettingsRepository adminSettingsRepository) {
        this.adminSettingsRepository = adminSettingsRepository;
    }

    public List<AdminSettingsDTO> getAllSettings() {
        return adminSettingsRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public AdminSettingsDTO getSettingsById(Integer id) {
        AdminSettings entity = adminSettingsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin settings not found with ID: " + id));
        return toDTO(entity);
    }

    public AdminSettingsDTO createSettings(AdminSettingsDTO dto) {
        AdminSettings entity = new AdminSettings();
        entity.setNumberOfUnits(dto.getNumberOfUnits());
        entity.setTotalSquareFeet(dto.getTotalSquareFeet());
        AdminSettings saved = adminSettingsRepository.save(entity);
        return toDTO(saved);
    }

    public AdminSettingsDTO updateSettings(Integer id, AdminSettingsDTO dto) {
        AdminSettings entity = adminSettingsRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Admin settings not found with ID: " + id));
        entity.setNumberOfUnits(dto.getNumberOfUnits());
        entity.setTotalSquareFeet(dto.getTotalSquareFeet());
        AdminSettings saved = adminSettingsRepository.save(entity);
        return toDTO(saved);
    }

    public void deleteSettings(Integer id) {
        if (!adminSettingsRepository.existsById(id)) {
            throw new ResourceNotFoundException("Admin settings not found with ID: " + id);
        }
        adminSettingsRepository.deleteById(id);
    }

    private AdminSettingsDTO toDTO(AdminSettings entity) {
        return new AdminSettingsDTO(entity.getId(), entity.getNumberOfUnits(), entity.getTotalSquareFeet());
    }
}
