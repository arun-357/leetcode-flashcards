import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class PostFeedService {
    private Map<String, List<Post>> userFeeds = new HashMap<>();
    private PostFeedGenerationStrategy strategy = new ChronologicalStrategy();

    public void setStrategy(PostFeedGenerationStrategy strategy) {
        this.strategy = strategy;
    }

    public void addPostToUserFeed(String userId, Post post) {
        userFeeds.computeIfAbsent(userId, k -> new ArrayList<>()).add(post);
    }

    public List<Post> getPostFeed(String userId) {
        return strategy.getPostFeed(userId, userFeeds);
    }
}
