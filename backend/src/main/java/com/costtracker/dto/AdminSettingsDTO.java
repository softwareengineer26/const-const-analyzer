package com.costtracker.dto;

public class AdminSettingsDTO {

    private Integer id;
    private Integer numberOfUnits;
    private Integer totalSquareFeet;

    public AdminSettingsDTO() {
    }

    public AdminSettingsDTO(Integer id, Integer numberOfUnits, Integer totalSquareFeet) {
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
