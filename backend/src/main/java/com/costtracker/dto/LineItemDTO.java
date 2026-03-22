package com.costtracker.dto;

public class LineItemDTO {

    private Integer lineItemId;
    private String groupName;
    private String lineItemName;

    public LineItemDTO() {
    }

    public LineItemDTO(Integer lineItemId, String groupName, String lineItemName) {
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
