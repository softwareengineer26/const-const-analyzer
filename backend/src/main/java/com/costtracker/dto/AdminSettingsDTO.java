package com.costtracker.dto;

import java.math.BigDecimal;

public class AdminSettingsDTO {

    private Integer id;
    private Integer numberOfUnits;
    private Integer totalSquareFeet;
    private BigDecimal expectedMonthlyRentEst1;
    private BigDecimal expectedMonthlyRentEst2;

    public AdminSettingsDTO() {
    }

    public AdminSettingsDTO(Integer id, Integer numberOfUnits, Integer totalSquareFeet,
                            BigDecimal expectedMonthlyRentEst1, BigDecimal expectedMonthlyRentEst2) {
        this.id = id;
        this.numberOfUnits = numberOfUnits;
        this.totalSquareFeet = totalSquareFeet;
        this.expectedMonthlyRentEst1 = expectedMonthlyRentEst1;
        this.expectedMonthlyRentEst2 = expectedMonthlyRentEst2;
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

    public BigDecimal getExpectedMonthlyRentEst1() {
        return expectedMonthlyRentEst1;
    }

    public void setExpectedMonthlyRentEst1(BigDecimal expectedMonthlyRentEst1) {
        this.expectedMonthlyRentEst1 = expectedMonthlyRentEst1;
    }

    public BigDecimal getExpectedMonthlyRentEst2() {
        return expectedMonthlyRentEst2;
    }

    public void setExpectedMonthlyRentEst2(BigDecimal expectedMonthlyRentEst2) {
        this.expectedMonthlyRentEst2 = expectedMonthlyRentEst2;
    }
}
