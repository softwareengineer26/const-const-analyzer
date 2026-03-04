package com.costtracker.controller;

import com.costtracker.dto.LineItemDTO;
import com.costtracker.service.LineItemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/line-items")
public class LineItemController {

    private final LineItemService lineItemService;

    public LineItemController(LineItemService lineItemService) {
        this.lineItemService = lineItemService;
    }

    @GetMapping
    public ResponseEntity<List<LineItemDTO>> getAllLineItems() {
        return ResponseEntity.ok(lineItemService.getAllLineItems());
    }
}
