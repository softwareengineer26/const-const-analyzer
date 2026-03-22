package com.costtracker.controller;

import com.costtracker.dto.AdminSettingsDTO;
import com.costtracker.service.AdminSettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin-settings")
public class AdminSettingsController {

    private final AdminSettingsService adminSettingsService;

    public AdminSettingsController(AdminSettingsService adminSettingsService) {
        this.adminSettingsService = adminSettingsService;
    }

    @GetMapping
    public ResponseEntity<List<AdminSettingsDTO>> getAllSettings() {
        return ResponseEntity.ok(adminSettingsService.getAllSettings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminSettingsDTO> getSettingsById(@PathVariable Integer id) {
        return ResponseEntity.ok(adminSettingsService.getSettingsById(id));
    }

    @PostMapping
    public ResponseEntity<AdminSettingsDTO> createSettings(@RequestBody AdminSettingsDTO dto) {
        AdminSettingsDTO created = adminSettingsService.createSettings(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminSettingsDTO> updateSettings(@PathVariable Integer id, @RequestBody AdminSettingsDTO dto) {
        return ResponseEntity.ok(adminSettingsService.updateSettings(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSettings(@PathVariable Integer id) {
        adminSettingsService.deleteSettings(id);
        return ResponseEntity.noContent().build();
    }
}
