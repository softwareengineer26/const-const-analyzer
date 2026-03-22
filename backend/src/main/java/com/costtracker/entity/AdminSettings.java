package com.costtracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "admin_settings")
public class AdminSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "number_of_units")
    private Integer numberOfUnits;

    @Column(name = "total_square_feet")
    private Integer totalSquareFeet;

    public AdminSettings() {
    }

    public AdminSettings(Integer id, Integer numberOfUnits, Integer totalSquareFeet) {
        this.id = id;
        this.numberOfUnits = numberOfUnits;
        this.totalSquareFeet = totalSquareFeet;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getNumberOfUnits() {
        return numberOfUnits;
    }

    public void setNumberOfUnits(Integer numberOfUnits) {
        this.numberOfUnits = numberOfUnits;
    }

    public Integer getTotalSquareFeet() {
        return totalSquareFeet;
    }

    public void setTotalSquareFeet(Integer totalSquareFeet) {
        this.totalSquareFeet = totalSquareFeet;
    }
}
