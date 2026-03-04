package com.costtracker.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public class CaseLineItemUpdateDTO {

    @NotNull(message = "Line item ID is required")
    private Integer lineItemId;

    @DecimalMax(value = "10000000", message = "Amount must not exceed 10,000,000")
    private BigDecimal amount;

    @DecimalMax(value = "10000000", message = "Unit amount must not exceed 10,000,000")
    private BigDecimal unitAmount;

    @DecimalMax(value = "1000", message = "Per sq.ft. must not exceed 1,000")
    private BigDecimal perSqft;

    @Size(max = 300, message = "Comments must not exceed 300 characters")
    private String comments;

    public CaseLineItemUpdateDTO() {
    }

    public Integer getLineItemId() {
        return lineItemId;
    }

    public void setLineItemId(Integer lineItemId) {
        this.lineItemId = lineItemId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getUnitAmount() {
        return unitAmount;
    }

    public void setUnitAmount(BigDecimal unitAmount) {
        this.unitAmount = unitAmount;
    }

    public BigDecimal getPerSqft() {
        return perSqft;
    }

    public void setPerSqft(BigDecimal perSqft) {
        this.perSqft = perSqft;
    }

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
