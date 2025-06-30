package com.tnp.tnpbackend.dto;

import lombok.Data;

@Data
public class DeactivationRequestDTO {
    private String username;         // Required: The user to deactivate
    private String reason;           // Optional: Reason for deactivation
    private boolean notifyUser = true; // Optional: Whether to send a notification (default true)
}