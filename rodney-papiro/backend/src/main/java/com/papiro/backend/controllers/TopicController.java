package com.papiro.backend.controllers;

import com.papiro.backend.dtos.CompleteTopicDTO;
import com.papiro.backend.models.Topic;
import com.papiro.backend.services.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping("/{id}/complete")
    public ResponseEntity<?> completeTopic(@PathVariable String id, @RequestBody CompleteTopicDTO dto) {
        try {
            Topic updated = topicService.completeTopic(id, dto);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}