# Guide: When to Extract Code to Utility Classes

## Principles for Utility Class Extraction

### ✅ **EXTRACT When You Have:**

#### 1. **Repeated Logic Across Multiple Classes**
If you find the same logic implemented in 2+ places, extract it to a utility class.

**Example from your codebase:**
- Both `UserService` and `ItemService` have similar `getById()` methods with exception handling
- Both check if `Optional.isPresent()` and throw exceptions

**Should extract:**
```java
public class ValidationUtils {
    public static <T> T requirePresent(Optional<T> optional, Supplier<? extends RuntimeException> exceptionSupplier) {
        return optional.orElseThrow(exceptionSupplier);
    }
}
```

#### 2. **Pure Functions (No Side Effects)**
Functions that take inputs, return outputs, and don't modify state.

**Examples:**
- String manipulation/formatting
- Date/time calculations
- Data transformations
- Mathematical calculations
- Validation checks that don't require database access

**From your codebase:**
- `USERNAME_ALREADY_TAKEN.formatted(registerRequest.getUsername())` - string formatting
- Sorting logic in `getAllUsers()` and `findAllItems()`
- Name parsing in `processOAuth2User()` (splitting full name)

#### 3. **Constants Shared Across Classes**
If constants are used in multiple places, centralize them.

**From your codebase:**
- `ERROR_MESSAGE = "errorMessage"` - used in `LoginErrorHandler` and `GlobalControllerAdvice`
- Exception messages used in multiple services
- Magic strings/numbers

**Should create:**
```java
public class MessageConstants {
    public static final String ERROR_MESSAGE = "errorMessage";
    public static final String USERNAME_ALREADY_TAKEN = "Username %s is already taken";
    // ... other shared messages
}
```

#### 4. **Stateless Helper Methods**
Methods that don't need instance state or dependency injection.

**Examples from your codebase:**
- `LoginErrorHandler.handleLoginErrors()` - perfect example! ✅
- Session attribute key management
- Error message formatting
- Name parsing/extraction

#### 5. **Cross-Cutting Concerns**
Functionality that doesn't belong to any specific domain.

**Examples:**
- Error handling (like `LoginErrorHandler`)
- Model attribute management
- Redirect URL construction
- File name sanitization
- URL validation

---

### ❌ **DON'T Extract When:**

#### 1. **Business Logic Specific to One Domain**
If the logic is core to a service's responsibility, keep it there.

**Example:**
- `UserService.register()` - this is core business logic
- `ItemService.postItem()` - domain-specific

#### 2. **Methods Requiring Dependency Injection**
If you need Spring beans or other dependencies, it's not a utility.

**Example:**
- Methods that need `UserRepository`, `PasswordEncoder`, etc.
- These should stay in services or be extracted to other services

#### 3. **Stateful Operations**
If the method modifies or depends on instance state.

**Example:**
- Methods that modify `this.someField`
- Methods that depend on injected dependencies

#### 4. **Single Use Case**
If code is only used in one place, extraction might be premature optimization.

**Exception:** Extract if it significantly improves readability or testability.

#### 5. **Tightly Coupled to Framework**
If it's deeply integrated with Spring, keep it in the service layer.

---

## Examples from Your Codebase

### ✅ **Good Candidates for Extraction:**

#### 1. **Exception Message Constants**
**Current:** Constants scattered across services
```java
// UserService.java
public static final String USERNAME_ALREADY_TAKEN = "Username %s is already taken";
public static final String NO_SUCH_USER_FOUND = "No such user found";

// WishlistService.java
public static final String ITEM_ALREADY_IN_YOUR_WISHLIST = "Item is already saved in your wishlist";
```

**Should extract to:**
```java
public class ExceptionMessages {
    public static final String USERNAME_ALREADY_TAKEN = "Username %s is already taken";
    public static final String NO_SUCH_USER_FOUND = "No such user found";
    public static final String ITEM_ALREADY_IN_YOUR_WISHLIST = "Item is already saved in your wishlist";
    public static final String ITEM_NOT_FOUND = "Item not found";
    public static final String ACCESS_DENIED = "Access denied";
}
```

#### 2. **Validation Utilities**
**Current:** Repeated Optional checking
```java
// UserService.java
Optional<User> user = userRepository.findById(userId);
if (user.isEmpty()) {
    throw new UserDoesNotExistException(NO_SUCH_USER_FOUND);
}

// ItemService.java
return itemRepository.findById(itemId)
    .orElseThrow(() -> new ItemNotFoundException("Item not found"));
```

**Should extract to:**
```java
public class ValidationUtils {
    public static <T> T requirePresent(Optional<T> optional, Supplier<? extends RuntimeException> exceptionSupplier) {
        return optional.orElseThrow(exceptionSupplier);
    }
    
    public static <T> void requireEmpty(Optional<T> optional, Supplier<? extends RuntimeException> exceptionSupplier) {
        if (optional.isPresent()) {
            throw exceptionSupplier.get();
        }
    }
}
```

#### 3. **Sorting Utilities**
**Current:** Custom sorting logic in services
```java
// UserService.getAllUsers()
.sorted((u1, u2) -> {
    String firstName1 = u1.getFirstName() != null ? u1.getFirstName() : "";
    String firstName2 = u2.getFirstName() != null ? u2.getFirstName() : "";
    // ... more sorting logic
})

// ItemService.findAllItems()
allItems.sort(Comparator.comparing(Item::getCreatedOn));
```

**Should extract to:**
```java
public class SortingUtils {
    public static Comparator<User> userByNameComparator() {
        return Comparator
            .comparing((User u) -> u.getFirstName() != null ? u.getFirstName() : "", String.CASE_INSENSITIVE_ORDER)
            .thenComparing(u -> u.getLastName() != null ? u.getLastName() : "", String.CASE_INSENSITIVE_ORDER);
    }
    
    public static <T extends Comparable<T>> Comparator<T> byCreatedOn() {
        return Comparator.comparing(Item::getCreatedOn);
    }
}
```

#### 4. **String/Name Utilities**
**Current:** Name parsing in UserService
```java
// UserService.processOAuth2User()
String[] wholeName = name.split(" ");
String username = email.split("@")[0];
String firstName = wholeName.length > 1 ? wholeName[0] : name;
String lastName = wholeName.length > 1 ? wholeName[1] : "";
```

**Should extract to:**
```java
public class NameUtils {
    public static String[] parseFullName(String fullName) {
        String[] parts = fullName.split(" ");
        if (parts.length > 1) {
            return new String[]{parts[0], String.join(" ", Arrays.copyOfRange(parts, 1, parts.length))};
        }
        return new String[]{fullName, ""};
    }
    
    public static String extractUsernameFromEmail(String email) {
        return email.split("@")[0];
    }
}
```

#### 5. **Session/Model Attribute Utilities**
**Current:** Attribute keys scattered
```java
// LoginErrorHandler
private static final String INACTIVE_USER_MESSAGE = "inactiveUserMessage";
private static final String ERROR_MESSAGE = "errorMessage";

// GlobalControllerAdvice
redirectAttributes.addFlashAttribute("errorMessage", exception.getMessage());
```

**Should extract to:**
```java
public class SessionAttributes {
    public static final String ERROR_MESSAGE = "errorMessage";
    public static final String INACTIVE_USER_MESSAGE = "inactiveUserMessage";
    public static final String SUCCESS_MESSAGE = "successMessage";
}
```

---

## Design Principles for Utility Classes

### 1. **Final Class with Private Constructor**
Prevent instantiation:
```java
public final class ValidationUtils {
    private ValidationUtils() {
        throw new UnsupportedOperationException("Utility class");
    }
    // static methods...
}
```

### 2. **Static Methods Only**
No instance methods or state.

### 3. **Clear Naming**
- Use descriptive names: `ValidationUtils`, `StringUtils`, `DateUtils`
- Group related functionality together

### 4. **Documentation**
Document methods, especially complex ones:
```java
/**
 * Validates that an Optional contains a value, throwing the provided exception if empty.
 *
 * @param optional the Optional to check
 * @param exceptionSupplier supplier for the exception to throw if empty
 * @param <T> the type of value
 * @return the value if present
 * @throws RuntimeException if the Optional is empty
 */
public static <T> T requirePresent(Optional<T> optional, Supplier<? extends RuntimeException> exceptionSupplier) {
    return optional.orElseThrow(exceptionSupplier);
}
```

### 5. **Single Responsibility**
Each utility class should have a clear, single purpose:
- `ValidationUtils` - validation logic
- `StringUtils` - string manipulation
- `DateUtils` - date/time operations
- `MessageConstants` - shared constants

---

## Decision Tree

```
Is the code used in 2+ places?
├─ No → Keep it where it is (unless it improves readability significantly)
└─ Yes → Does it require dependencies or instance state?
    ├─ Yes → Keep in service or create a service class
    └─ No → Is it a pure function or constant?
        ├─ Yes → Extract to utility class ✅
        └─ No → Re-evaluate - might still be a good candidate
```

---

## Quick Checklist

Before extracting to a utility class, ask:

1. ✅ Is this logic used in multiple places?
2. ✅ Is it a pure function (no side effects)?
3. ✅ Does it not require dependency injection?
4. ✅ Is it stateless?
5. ✅ Would extracting it improve maintainability?
6. ✅ Is it a cross-cutting concern?
7. ✅ Does it have a clear, single responsibility?

If you answered "yes" to most questions, extract it!

---

## Anti-Patterns to Avoid

### ❌ **God Utility Class**
Don't create one massive utility class with everything:
```java
// BAD
public class Utils {
    // validation, string, date, file, network, etc.
}
```

### ❌ **Utility Classes with State**
```java
// BAD
public class StringUtils {
    private String currentString; // NO!
}
```

### ❌ **Business Logic in Utilities**
```java
// BAD
public class UserUtils {
    public static void registerUser(User user) { // This needs UserRepository!
        // ...
    }
}
```

### ❌ **Over-Extraction**
Don't extract single-use methods unless they significantly improve code clarity.

---

## Summary

**Extract to utility classes when:**
- Logic is repeated across multiple classes
- It's a pure function (no side effects, no state)
- It doesn't require dependency injection
- It's a cross-cutting concern
- It improves maintainability and testability

**Keep in services when:**
- It's core business logic
- It requires dependencies
- It's domain-specific
- It's only used in one place (unless it improves readability)

Your `LoginErrorHandler` is a perfect example of a well-designed utility class! Use it as a template for future extractions.
