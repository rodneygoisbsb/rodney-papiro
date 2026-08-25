package com.papiro.backend.controllers;

import com.papiro.backend.dtos.DashboardMetricsDTO;
import com.papiro.backend.models.*;
import com.papiro.backend.services.StudyPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardMetricsDTO> getDashboard() {
        return ResponseEntity.ok(studyPlanService.getDashboardData());
    }

    @GetMapping("/plans")
    public ResponseEntity<List<StudyPlan>> getPlans() {
        return ResponseEntity.ok(studyPlanService.getAllPlans());
    }

    @GetMapping("/plans/{planId}/subjects")
    public ResponseEntity<List<Subject>> getSubjects(@PathVariable String planId) {
        return ResponseEntity.ok(studyPlanService.getSubjectsByPlan(planId));
    }

    @GetMapping("/subjects/{subjectId}/topics")
    public ResponseEntity<List<Topic>> getTopics(@PathVariable String subjectId) {
        return ResponseEntity.ok(studyPlanService.getTopicsBySubject(subjectId));
    }
}