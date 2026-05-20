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
import java.util.Map;

import org.jboss.resteasy.reactive.RestForm;

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
    // AuthResource.java 아래 새로 추가
    @GET
    @Path("/register")
    @Produces(MediaType.TEXT_HTML)
    public Response registerPage() {
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/register.html");

        if (html == null) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("register.html 파일을 찾을 수 없습니다.")
                    .build();
        }

        return Response.ok(html).build();
    }

    @POST
    @Path("/register_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response registerCheck(
            @FormParam("username") String username,
            @FormParam("password") String password, // SHA-256 해시값
            @FormParam("email") String email,
            @FormParam("phone") String phone) {
        // ① 아이디 중복 체크
        if (User.findByUsername(username) != null) {
            return Response
                    .seeOther(URI.create("/register?error=duplicate_username"))
                    .build();
        }

        // ② 이메일 중복 체크
        if (User.findByEmail(email) != null) {
            return Response
                    .seeOther(URI.create("/register?error=duplicate_email"))
                    .build();
        }

        // ③ DB 삽입
        User newUser = new User();
        newUser.username = username;
        newUser.password = password; // 해시값 저장
        newUser.email = email;
        newUser.phone = phone;
        newUser.persist();

        // ④ 가입 완료 페이지로 이동
        return Response
                .seeOther(URI.create("/register_success"))
                .build();
    }
@GET
@Path("/register_success")
@Produces(MediaType.TEXT_HTML)
public Response registerSuccess() {
    InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/register_success.html");

    if (html == null) {
        return Response.status(Response.Status.NOT_FOUND)
                .entity("register_success.html 파일을 찾을 수 없습니다.")
                .build();
    }

    return Response.ok(html).build();
}
    // GET / → 세션 유무에 따라 메인 페이지 분기
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response mainPage() {
        String loginUser = context.session().get("loginUser");
        System.out.println("=== [GET /] 세션 ID : " + context.session().id());
        System.out.println("=== [GET /] loginUser : " + loginUser);
        String htmlPath = (loginUser != null)
                ? "META-INF/resources/login/main_after_login.html"
                : "META-INF/resources/main_index.html";
        InputStream html = getClass().getClassLoader().getResourceAsStream(htmlPath);
        return Response.ok(html).build();
    }
    @GET
    @Path("/profile")
    @Produces(MediaType.TEXT_HTML)
    public Response profilePage() {
        // ① 세션 체크 (로그인 안 한 사용자 차단)
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                    .seeOther(URI.create("/login"))
                    .build();
        }
        // ② DB에서 사용자 정보 조회
        User user = User.findByUsername(loginUser);
        // ③ 세션에 사용자 정보 저장 (HTML에서 활용)
        context.session().put("userEmail", user.email);
        context.session().put("userPhone", user.phone);
        // ④ 프로필 페이지 반환
        InputStream html = getClass()
                .getClassLoader()
                .getResourceAsStream("META-INF/resources/login/profile.html");
        return Response.ok(html).build();
    }
    @GET
@Path("/profile/info")
@Produces(MediaType.APPLICATION_JSON)
public Response profileInfo() {
// 세션 체크
String loginUser = context.session().get("loginUser");
if (loginUser == null) {
return Response.status(401).build();
}
// DB 조회
User user = User.findByUsername(loginUser);
// JSON 응답
return Response.ok(
Map.of(
"username", user.username,
"email", user.email != null ? user.email : "",
"phone", user.phone != null ? user.phone : "",
"profileImage", user.profileImage != null
? user.profileImage : ""
)
).build();

}
}
