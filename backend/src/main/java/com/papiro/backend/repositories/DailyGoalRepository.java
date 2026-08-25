package com.papiro.backend.repositories;

import com.papiro.backend.models.DailyGoal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface DailyGoalRepository extends JpaRepository<DailyGoal, String> {
    List<DailyGoal> findByScheduledDate(LocalDate date);
    List<DailyGoal> findByScheduledDateBetween(LocalDate startDate, LocalDate endDate);
}