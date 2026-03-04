package com.costtracker.dto;

public class LineItemDTO {

    private Integer lineItemId;
    private String lineItemName;

    public LineItemDTO() {
    }

    public LineItemDTO(Integer lineItemId, String lineItemName) {
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
