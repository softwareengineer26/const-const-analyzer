package com.costtracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;

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

    @Column(name = "expected_monthly_rent_est1", precision = 12, scale = 2)
    private BigDecimal expectedMonthlyRentEst1;

    @Column(name = "expected_monthly_rent_est2", precision = 12, scale = 2)
    private BigDecimal expectedMonthlyRentEst2;

    public AdminSettings() {
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
