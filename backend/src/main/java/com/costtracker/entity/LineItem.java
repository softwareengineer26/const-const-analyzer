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

    @Column(name = "group_name", length = 150)
    private String groupName;

    @Column(name = "line_item_name", nullable = false, length = 150)
    private String lineItemName;

    public LineItem() {
    }

    public LineItem(Integer lineItemId, String groupName, String lineItemName) {
        this.lineItemId = lineItemId;
        this.groupName = groupName;
        this.lineItemName = lineItemName;
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
}
