package com.app.nexio.user.repository;

import com.app.nexio.user.model.User;
import com.app.nexio.user.model.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    Optional<User> findByUsername(String username);

    @Query("SELECT u FROM User u WHERE u.username = :value OR u.email = :value")
    Optional<User> findByUsernameOrEmail(@Param("value") String usernameOrEmail);

    Optional<User> findUserByEmail(String email);

    List<User> getAllByActiveAccount(boolean activeAccount);

    List<User> getAllByRole(UserRole role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = :role AND u.activeAccount = true")
    long countActiveUsersByRole(@Param("role") UserRole role);

    List<User> getAllByGraduationYearBefore(Integer graduationYearBefore);
}
