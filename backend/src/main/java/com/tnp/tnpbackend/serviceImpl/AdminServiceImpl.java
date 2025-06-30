package com.tnp.tnpbackend.serviceImpl;

import com.tnp.tnpbackend.exception.NoDataFoundException;
import com.tnp.tnpbackend.model.Recruiter;
import com.tnp.tnpbackend.model.Student;
import com.tnp.tnpbackend.model.StudentRecruiterRelation;
import com.tnp.tnpbackend.repository.RecruiterRepository;
import com.tnp.tnpbackend.repository.StudentRecruiterRelationRepository;
import com.tnp.tnpbackend.repository.StudentRepository;
import com.tnp.tnpbackend.service.AdminService;
import com.tnp.tnpbackend.service.AppUser;
import com.tnp.tnpbackend.service.StudentService;
import com.tnp.tnpbackend.utils.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private StudentRecruiterRelationRepository relationRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private RecruiterRepository recruiterRepository;

    @Autowired
    private StudentService studentService;

    @Autowired
    private EmailService emailService;

    @Override
    public Map<String, Long> getApplicationStatusAnalytics() {
        List<StudentRecruiterRelation> relations = relationRepository.findAll();
        if (relations.isEmpty()) {
            throw new NoDataFoundException("No application data found for analytics");
        }
        Map<String, Long> statusCounts = new HashMap<>();

        statusCounts.put("APPLIED", relations.stream().filter(r -> "APPLIED".equals(r.getStatus())).count());
        statusCounts.put("INTERVIEWED", relations.stream().filter(r -> "INTERVIEWED".equals(r.getStatus())).count());
        statusCounts.put("HIRED", relations.stream().filter(r -> "HIRED".equals(r.getStatus())).count());

        return statusCounts;
    }

    @Override
    public Map<String, Long> getStudentsByDepartmentAnalytics() {
        List<String> departments = studentService.findDistinctDepartments();
        if (departments.isEmpty()) {
            throw new NoDataFoundException("No application data found for analytics");
        }
        Map<String, Long> departmentCounts = new HashMap<>();

        for (String dept : departments) {
            long count = studentRepository.findByDepartment(dept).size();
            departmentCounts.put(dept, count);
        }

        return departmentCounts;
    }

    @Override
    public Map<String, Double> getPlacementSuccessRateAnalytics() {
        List<String> departments = studentService.findDistinctDepartments();
        if (departments.isEmpty()) {
            throw new NoDataFoundException("No application data found for analytics");
        }
        Map<String, Double> successRates = new HashMap<>();

        for (String dept : departments) {
            List<Student> deptStudents = studentRepository.findByDepartment(dept);
            if (deptStudents.isEmpty()) {
                throw new NoDataFoundException("No application data found for placement success rate analytics");
            }
            long totalStudents = deptStudents.size();
            if (totalStudents == 0) {
                continue;
            }

            long hiredCount = relationRepository.findAll().stream()
                    .filter(r -> "HIRED".equals(r.getStatus()) && dept.equals(r.getStudent().getDepartment()))
                    .count();

            double successRate = (double) hiredCount / totalStudents * 100;
            successRates.put(dept, Math.round(successRate * 100.0) / 100.0); // Round to 2 decimals
        }

        return successRates;
    }

    @Override
    public List<Map<String, Object>> getTopRecruitersAnalytics() {
        Map<Recruiter, Long> hireCounts = relationRepository.findAll().stream()
                .filter(r -> "HIRED".equals(r.getStatus()))
                .collect(Collectors.groupingBy(StudentRecruiterRelation::getRecruiter, Collectors.counting()));

        return hireCounts.entrySet().stream()
                .sorted(Map.Entry.<Recruiter, Long>comparingByValue().reversed())
                .limit(5) // Top 5 recruiters
                .map(entry -> {
                    Map<String, Object> recruiterData = new HashMap<>();
                    recruiterData.put("companyName", entry.getKey().getCompanyName());
                    recruiterData.put("hiredCount", entry.getValue());
                    return recruiterData;
                })
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, Map<String, Long>> getRecruiterApplicationAnalytics() {
        List<Recruiter> recruiters = recruiterRepository.findAll();
        if (recruiters.isEmpty()) {
            throw new NoDataFoundException("No application data found for analytics");
        }
        Map<String, Map<String, Long>> recruiterStats = new HashMap<>();

        for (Recruiter recruiter : recruiters) {
            List<StudentRecruiterRelation> relations = relationRepository.findByRecruiter(recruiter);
            Map<String, Long> statusCounts = new HashMap<>();

            statusCounts.put("APPLIED", relations.stream().filter(r -> "APPLIED".equals(r.getStatus())).count());
            statusCounts.put("INTERVIEWED",
                    relations.stream().filter(r -> "INTERVIEWED".equals(r.getStatus())).count());
            statusCounts.put("HIRED", relations.stream().filter(r -> "HIRED".equals(r.getStatus())).count());

            recruiterStats.put(recruiter.getCompanyName(), statusCounts);
        }

        return recruiterStats;
    }

    @Override
    public void sendDeactivationWarning(String username, String reason, boolean notifyUser) {
        AppUser user = studentRepository.findByUsername(username)
                .orElseThrow(() -> new NoDataFoundException("User not found with username: " + username));
        String email = getEmailForUser(user);
        if (email == null || email.isEmpty()) {
            throw new IllegalStateException("User has no email address");
        }
        String subject = "Account Deactivation Warning";
        String body = String.format(
                "Dear %s,\n\nYour account is scheduled for deactivation. Please contact the admin if you believe this is an error.\n\nRegards,\nTNP Team",
                username);
        emailService.sendEmail(email, subject, body);
    }

    @Override
    public void deactivateUser(String username) {
        AppUser user = studentRepository.findByUsername(username)
                .orElseThrow(() -> new NoDataFoundException("User not found with username: " + username));
        if (user instanceof Student) {
            Student student = (Student) user;
            student.setActive(false);
            studentRepository.save(student);
        }
    }

    private String getEmailForUser(AppUser user) {
        if (user instanceof Student) {
            return ((Student) user).getEmail();
        }
        return "Email not available for this user type";
    }

    // private String getAuthenticatedUsername() {
    //     Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    //     if (principal instanceof UserDetails) {
    //         return ((UserDetails) principal).getUsername();
    //     } else {
    //         return principal.toString();
    //     }
    // }
}