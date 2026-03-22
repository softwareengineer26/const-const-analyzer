package com.costtracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;

@Entity
@Table(name = "case_line_item_data", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"case_id", "line_item_id", "estimate_id"})
})
public class CaseLineItemData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "case_id", nullable = false)
    private Integer caseId;

    @Column(name = "line_item_id", nullable = false)
    private Integer lineItemId;

    @Column(name = "estimate_id", nullable = false)
    private Integer estimateId;

    @Column(name = "amount", precision = 12, scale = 2)
    private BigDecimal amount;

    @Column(name = "unit_amount", precision = 12, scale = 2)
    private BigDecimal unitAmount;

    @Column(name = "per_sqft", precision = 8, scale = 2)
    private BigDecimal perSqft;

    @Column(name = "comments", length = 300)
    private String comments;

    @ManyToOne
    @JoinColumn(name = "case_id", insertable = false, updatable = false)
    private Case caseEntity;

    @ManyToOne
    @JoinColumn(name = "line_item_id", insertable = false, updatable = false)
    private LineItem lineItem;

    public CaseLineItemData() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getCaseId() {
        return caseId;
    }

    public void setCaseId(Integer caseId) {
        this.caseId = caseId;
    }

    public Integer getLineItemId() {
        return lineItemId;
    }

    public void setLineItemId(Integer lineItemId) {
        this.lineItemId = lineItemId;
    }

    public Integer getEstimateId() {
        return estimateId;
    }

    public void setEstimateId(Integer estimateId) {
        this.estimateId = estimateId;
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

    public Case getCaseEntity() {
        return caseEntity;
    }

    public void setCaseEntity(Case caseEntity) {
        this.caseEntity = caseEntity;
    }

    public LineItem getLineItem() {
        return lineItem;
    }

    public void setLineItem(LineItem lineItem) {
        this.lineItem = lineItem;
    }
}
