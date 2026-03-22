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

    public String getComments() {
        return comments;
    }

    public void setComments(String comments) {
        this.comments = comments;
    }
}
