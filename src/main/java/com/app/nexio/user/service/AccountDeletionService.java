package com.app.nexio.user.service;

import com.app.nexio.item.repository.ItemRepository;
import com.app.nexio.user.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Slf4j
@Service
@Transactional
public class AccountDeletionService {

    private final UserService userService;
    private final ItemRepository itemRepository;

    public AccountDeletionService(UserService userService, ItemRepository itemRepository) {
        this.userService = userService;
        this.itemRepository = itemRepository;
    }

    public void deleteUserAccount(UUID userId, HttpServletRequest request, HttpServletResponse response) {
        log.info("Deleting user account for user ID: {}", userId);

        User user = userService.getById(userId);
        
        itemRepository.findByOwner(user).forEach(item -> {
            item.setDeleted(true);
            itemRepository.save(item);
        });

        userService.switchStatus(userId);

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            new SecurityContextLogoutHandler().logout(request, response, auth);
            log.info("User logged out successfully after account deletion: {}", userId);
        }
    }
}