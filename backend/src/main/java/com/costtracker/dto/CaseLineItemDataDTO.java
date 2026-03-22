package com.costtracker.dto;

import java.math.BigDecimal;

public class CaseLineItemDataDTO {

    private Integer lineItemId;
    private String groupName;
    private String lineItemName;
    private BigDecimal amount;
    private BigDecimal unitAmount;
    private BigDecimal perSqft;
    private String comments;

    public CaseLineItemDataDTO() {
    }

    public CaseLineItemDataDTO(Integer lineItemId, String groupName, String lineItemName,
                                BigDecimal amount, BigDecimal unitAmount,
                                BigDecimal perSqft, String comments) {
        this.lineItemId = lineItemId;
        this.groupName = groupName;
        this.lineItemName = lineItemName;
        this.amount = amount;
        this.unitAmount = unitAmount;
        this.perSqft = perSqft;
        this.comments = comments;
    }

    public Integer getLineItemId() {
        return lineItemId;
    }

    public void setLineItemId(Integer lineItemId) {
        this.lineItemId = lineItemId;
    }

    public String getGroupName() {
        return groupName;
    }

    public void setGroupName(String groupName) {
        this.groupName = groupName;
    }

    public String getLineItemName() {
        return lineItemName;
    }

    public void setLineItemName(String lineItemName) {
        this.lineItemName = lineItemName;
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
