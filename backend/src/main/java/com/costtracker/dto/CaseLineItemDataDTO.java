package com.costtracker.dto;

import java.math.BigDecimal;

public class CaseLineItemDataDTO {

    private Integer lineItemId;
    private String groupName;
    private String lineItemName;
    private BigDecimal est1Amount;
    private BigDecimal est1UnitAmount;
    private BigDecimal est1PerSqft;
    private String est1Comments;
    private BigDecimal est2Amount;
    private BigDecimal est2UnitAmount;
    private BigDecimal est2PerSqft;
    private String est2Comments;

    public CaseLineItemDataDTO() {
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

    public BigDecimal getEst1Amount() {
        return est1Amount;
    }

    public void setEst1Amount(BigDecimal est1Amount) {
        this.est1Amount = est1Amount;
    }

    public BigDecimal getEst1UnitAmount() {
        return est1UnitAmount;
    }

    public void setEst1UnitAmount(BigDecimal est1UnitAmount) {
        this.est1UnitAmount = est1UnitAmount;
    }

    public BigDecimal getEst1PerSqft() {
        return est1PerSqft;
    }

    public void setEst1PerSqft(BigDecimal est1PerSqft) {
        this.est1PerSqft = est1PerSqft;
    }

    public String getEst1Comments() {
        return est1Comments;
    }

    public void setEst1Comments(String est1Comments) {
        this.est1Comments = est1Comments;
    }

    public BigDecimal getEst2Amount() {
        return est2Amount;
    }

    public void setEst2Amount(BigDecimal est2Amount) {
        this.est2Amount = est2Amount;
    }

    public BigDecimal getEst2UnitAmount() {
        return est2UnitAmount;
    }

    public void setEst2UnitAmount(BigDecimal est2UnitAmount) {
        this.est2UnitAmount = est2UnitAmount;
    }

    public BigDecimal getEst2PerSqft() {
        return est2PerSqft;
    }

    public void setEst2PerSqft(BigDecimal est2PerSqft) {
        this.est2PerSqft = est2PerSqft;
    }

    public String getEst2Comments() {
        return est2Comments;
    }

    public void setEst2Comments(String est2Comments) {
        this.est2Comments = est2Comments;
    }
}
