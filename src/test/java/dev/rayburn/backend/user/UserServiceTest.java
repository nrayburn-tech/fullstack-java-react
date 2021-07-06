package dev.rayburn.backend.user;

import dev.rayburn.backend.entity.User;
import dev.rayburn.backend.repository.UserRepository;
import dev.rayburn.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.internal.verification.VerificationModeFactory;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;
    @InjectMocks
    private UserService userService;

    @Test
    public void whenFindUserThenReturnUser() {
        User user = new User();
        user.setId(1L);
        given(userRepository.findById(Mockito.anyLong())).willReturn(Optional.of(user));
        User foundUser = userService.findById(1L);
        assertEquals(user, foundUser);
    }

    @Test
    public void whenFindUserBadIdThenThrow() {
        given(userRepository.findById(Mockito.anyLong())).willReturn(Optional.empty());
        assertThrows(Exception.class, () -> userService.findById(1L));
        verify(userRepository, VerificationModeFactory.times(1)).findById(Mockito.anyLong());
    }

    @Test
    public void whenFindAllUserThenReturnAllUser() {
        User userOne = new User();
        userOne.setFirstName("Nick");
        User userTwo = new User();
        userTwo.setLastName("Rayburn");
        given(userRepository.findAll()).willReturn(Arrays.asList(userOne, userTwo));

        Iterable<User> users = userService.findAll();
        for (User user : users){
            assertTrue(userOne.getFirstName().equals(user.getFirstName()) ||
                    userTwo.getLastName().equals(user.getLastName()));
        }
        verify(userRepository, VerificationModeFactory.times(1)).findAll();
    }

    @Test
    public void whenUpdateUserThenUpdateUser() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Nick");
        user.setLastName("Rayburn");
        lenient().when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        lenient().when(userRepository.save(user)).thenReturn(user);

        User savedUser = userService.update(user);

        assertEquals(user, savedUser);
        verify(userRepository, VerificationModeFactory.times(1)).findById(1L);
        verify(userRepository, VerificationModeFactory.times(1)).save(user);
    }

    @Test
    public void whenUpdateUserBadIdThenThrow() {
        User user = new User();
        user.setId(1L);
        given(userRepository.findById(1L)).willReturn(Optional.empty());

        assertThrows(Exception.class, () -> userService.update(user));
        verify(userRepository, VerificationModeFactory.times(1)).findById(1L);
    }

    @Test
    public void whenSaveUserThenSaveUser() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Nick");
        user.setLastName("Rayburn");
        given(userRepository.save(user)).willReturn(user);

        User savedUser = userService.save(user);
        assertEquals(user, savedUser);

        verify(userRepository, VerificationModeFactory.times(1)).save(user);
    }

    @Test
    public void whenDeleteUserBadIdThenThrow() {
        given(userRepository.findById(1L)).willReturn(Optional.empty());

        assertThrows(Exception.class, () -> userService.delete(1L));
        verify(userRepository, VerificationModeFactory.times(1)).findById(1L);
    }

    @Test
    public void whenDeleteUserThenDelete() {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Nick");
        given(userRepository.findById(1L)).willReturn(Optional.of(user));

        userService.delete(1L);
        verify(userRepository, VerificationModeFactory.times(1)).deleteById(1L);
    }

}
