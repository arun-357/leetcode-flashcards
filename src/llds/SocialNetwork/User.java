import java.util.ArrayList;
import java.util.List;

public class User {
    private String userId;
    private String name;
    private List<String> friends = new ArrayList<>();

    public User(String userId, String name) {
        this.userId = userId;
        this.name = name;
    }

    public void addFriend(String friendId) {
        friends.add(friendId);
    }

    public String getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public List<String> getFriends() {
        return friends;
    }
}

