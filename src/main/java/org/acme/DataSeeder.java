package org.acme;
import org.acme.login.User;
import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class DataSeeder {

    @Transactional
    void onStart(@Observes StartupEvent ev) {
        // User 초기 데이터
        if (User.count() == 0) {
            User guest = new User();
            guest.username = "guest";
            guest.password = "123123";
            guest.persist();
        }

        // Champion 초기 데이터
        if (Champion.count() == 0) {
            persistChampion("아트록스", "전사", "탑");
            persistChampion("사일러스", "마법사", "정글/미드");
            persistChampion("애니비아", "마법사", "미드");
            persistChampion("브라이어", "전사", "정글");
            persistChampion("잭스", "전사", "탑");
            persistChampion("징크스", "원거리딜러", "원딜");
            persistChampion("야스오", "전사", "미드/탑");
            persistChampion("리신", "전사", "정글");
            persistChampion("티모", "마법사", "탑");
            persistChampion("케인", "암살자", "정글");
            persistChampion("루시안", "원거리딜러", "원딜/미드");
        }
    }

    private void persistChampion(String name, String role, String line) {
        Champion champion = new Champion();
        champion.name = name;
        champion.role = role;
        champion.line = line;
        champion.persist();
    }
}