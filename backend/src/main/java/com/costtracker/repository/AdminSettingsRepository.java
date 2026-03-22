package com.costtracker.repository;

import com.costtracker.entity.AdminSettings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminSettingsRepository extends JpaRepository<AdminSettings, Integer> {
}
