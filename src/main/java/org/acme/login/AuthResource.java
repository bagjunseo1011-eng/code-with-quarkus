package org.acme.login;

import io.vertx.ext.web.RoutingContext;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.io.InputStream;
import java.net.URI;

@Path("/")
public class AuthResource {

    @Inject
    RoutingContext context;

    @GET
    @Path("/login")
    @Produces(MediaType.TEXT_HTML)
    public Response loginPage() {
        return Response
                .seeOther(URI.create("/login/login.html"))
                .build();
    }

    @POST
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(
            @FormParam("username") String username,
            @FormParam("password") String password
    ) {
        User user = User.findByUsername(username);

        if (user == null || !user.password.equals(password)) {
            return Response
                    .seeOther(URI.create("/login?error=1"))
                    .build();
        }

        context.session().put("loginUser", username);

        System.out.println("=== 로그인 성공 ===");
        System.out.println("=== 세션 ID : " + context.session().id());
        System.out.println("=== loginUser : " + username);

        return Response
                .seeOther(URI.create("/after_login"))
                .build();
    }

    @GET
    @Path("/after_login")
    public Response afterLogin() {
        String loginUser = context.session().get("loginUser");

        System.out.println("=== 세션 ID : " + context.session().id());
        System.out.println("=== loginUser : " + loginUser);

        if (loginUser == null) {
            return Response
                    .seeOther(URI.create("/login"))
                    .build();
        }

        return Response
                .seeOther(URI.create("/login/main_after_login.html"))
                .build();
    }

    @GET
    @Path("/logout")
    public Response logout() {
        System.out.println("=== 로그아웃 전 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 전 loginUser : " + context.session().get("loginUser"));

        context.session().destroy();

        System.out.println("=== 로그아웃 완료 ===");

        return Response
                .seeOther(URI.create("/"))
                .build();
    }
}