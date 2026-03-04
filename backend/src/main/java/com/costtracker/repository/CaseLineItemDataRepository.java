package com.costtracker.repository;

import com.costtracker.entity.CaseLineItemData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CaseLineItemDataRepository extends JpaRepository<CaseLineItemData, Integer> {

    List<CaseLineItemData> findByCaseId(Integer caseId);

    Optional<CaseLineItemData> findByCaseIdAndLineItemId(Integer caseId, Integer lineItemId);
}
