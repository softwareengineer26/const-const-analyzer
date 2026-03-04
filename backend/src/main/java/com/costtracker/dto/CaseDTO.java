package com.costtracker.dto;

public class CaseDTO {

    private Integer caseId;
    private String caseName;
    private String caseContact;

    public CaseDTO() {
    }

    public CaseDTO(Integer caseId, String caseName, String caseContact) {
        this.caseId = caseId;
        this.caseName = caseName;
        this.caseContact = caseContact;
    }

    public Integer getCaseId() {
        return caseId;
    }

    public void setCaseId(Integer caseId) {
        this.caseId = caseId;
    }

    public String getCaseName() {
        return caseName;
    }

    public void setCaseName(String caseName) {
        this.caseName = caseName;
    }

    public String getCaseContact() {
        return caseContact;
    }

    public void setCaseContact(String caseContact) {
        this.caseContact = caseContact;
    }
}
