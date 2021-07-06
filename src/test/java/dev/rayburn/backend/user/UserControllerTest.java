package dev.rayburn.backend.user;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.rayburn.backend.controller.UserController;
import dev.rayburn.backend.entity.User;
import dev.rayburn.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.internal.verification.VerificationModeFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;


import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;
    @MockBean
    private UserService userService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    public void whenPostUserThenCreateUser() throws Exception {
        User user = new User();
        user.setFirstName("Nick");
        user.setLastName("Rayburn");
        JsonNode userJson = objectMapper.valueToTree(user);

        given(userService.save(user)).willReturn(user);

        mockMvc.perform(
                post("/api/user").contentType(MediaType.APPLICATION_JSON).content(userJson.toString()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName").value("Nick"))
                .andExpect(jsonPath("$.lastName").value("Rayburn"));
        verify(userService, VerificationModeFactory.times(1)).save(user);
    }

    @Test
    public void whenPatchUserThenUpdateUser() throws Exception {
        User user = new User();
        user.setFirstName("Nick");
        user.setLastName("Rayburn");
        JsonNode userJson = objectMapper.valueToTree(user);

        given(userService.update(user)).willReturn(user);

        mockMvc.perform(
                patch("/api/user").contentType(MediaType.APPLICATION_JSON).content(userJson.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Nick"))
                .andExpect(jsonPath("$.lastName").value("Rayburn"));
        verify(userService, VerificationModeFactory.times(1)).update(user);
    }

    @Test
    public void whenDeleteUserThenRemoveUser() throws Exception {
        mockMvc.perform(
                delete("/api/user/1"))
                .andExpect(status().isNoContent());
        verify(userService, VerificationModeFactory.times(1)).delete(1L);
    }

    @Test
    public void whenFindUserThenReturnUser() throws Exception {
        User user = new User();
        user.setId(1L);
        user.setFirstName("Nick");
        user.setLastName("Rayburn");

        given(userService.findById(1L)).willReturn(user);

        mockMvc.perform(
                get("/api/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Nick"))
                .andExpect(jsonPath("$.lastName").value("Rayburn"));
        verify(userService, VerificationModeFactory.times(1)).findById(1L);
    }

    @Test
    public void whenFindAllUserThenReturnAllUser() throws Exception {
        User userOne = new User();
        userOne.setFirstName("Nick");
        userOne.setLastName("Rayburn");

        User userTwo = new User();
        userTwo.setFirstName("Nick123");
        userTwo.setLastName("Rayburn123");

        given(userService.findAll()).willReturn(Arrays.asList(userOne, userTwo));

        mockMvc.perform(
                get("/api/user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].firstName").value("Nick"))
                .andExpect(jsonPath("$.[0].lastName").value("Rayburn"))
                .andExpect(jsonPath("$.[1].firstName").value("Nick123"))
                .andExpect(jsonPath("$.[1].lastName").value("Rayburn123"));
        verify(userService, VerificationModeFactory.times(1)).findAll();
    }
}
