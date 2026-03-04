package com.costtracker.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "line_items")
public class LineItem {

    @Id
    @Column(name = "line_item_id")
    private Integer lineItemId;

    @Column(name = "line_item_name", nullable = false, length = 150)
    private String lineItemName;

    public LineItem() {
    }

    public LineItem(Integer lineItemId, String lineItemName) {
        this.lineItemId = lineItemId;
        this.lineItemName = lineItemName;
    }

    public Integer getLineItemId() {
        return lineItemId;
    }

    public void setLineItemId(Integer lineItemId) {
        this.lineItemId = lineItemId;
    }

    public String getLineItemName() {
        return lineItemName;
    }

    public void setLineItemName(String lineItemName) {
        this.lineItemName = lineItemName;
    }
}
