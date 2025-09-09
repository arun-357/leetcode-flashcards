import java.util.HashMap;
import java.util.Map;

public class UserRepo {
    private static UserRepo instance;
    private Map<String, User> users = new HashMap<>();
    
    private UserRepo () {};

    public static synchronized UserRepo getInstance() {
        if (instance == null) {
            instance = new UserRepo();
        }
        return instance;
    }

    public void save(User user) {
        users.put(user.getUserId(), user);
    }

    public User findById(String userId) {
        return users.get(userId);
    }
}
