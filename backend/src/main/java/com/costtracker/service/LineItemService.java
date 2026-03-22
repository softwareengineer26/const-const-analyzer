package com.costtracker.service;

import com.costtracker.dto.LineItemDTO;
import com.costtracker.entity.LineItem;
import com.costtracker.repository.LineItemRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LineItemService {

    private final LineItemRepository lineItemRepository;

    public LineItemService(LineItemRepository lineItemRepository) {
        this.lineItemRepository = lineItemRepository;
    }

    public List<LineItemDTO> getAllLineItems() {
        return lineItemRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    private LineItemDTO toDTO(LineItem entity) {
        return new LineItemDTO(entity.getLineItemId(), entity.getGroupName(), entity.getLineItemName());
    }
}
