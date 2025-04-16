// Profile Information
export const PROFILE = {
  name: "John Doe",
  title: "Senior Android Developer",
  company: "Tech Innovations Inc.",
  location: "San Francisco, CA",
  education: "MSc in Computer Science",
  email: "contact@johndoe.dev",
  github: "https://github.com/johndoe",
  twitter: "https://twitter.com/johndoe",
  linkedin: "https://linkedin.com/in/johndoe",
  bio: "With over 7 years of experience developing Android applications, I've worked across various domains including fintech, health, productivity, and entertainment. My expertise spans from architecting robust solutions to implementing polished UIs."
};

// Skills for About Section
export const SKILLS = [
  "Kotlin",
  "Java",
  "MVVM",
  "Jetpack Compose",
  "Room",
  "Retrofit",
  "Coroutines",
  "Firebase"
];

// Code Samples
export const CODE_SAMPLES = [
  {
    id: 1,
    title: "Kotlin Flow Example",
    language: "kotlin",
    code: `class NewsRepository(
    private val newsApi: NewsApi,
    private val newsDao: NewsDao
) {
    fun getLatestNews(): Flow<Resource<List<NewsArticle>>> = flow {
        emit(Resource.Loading())
        
        try {
            // Fetch from network
            val apiResponse = newsApi.getLatestNews()
            
            // Save to database
            newsDao.insertAll(apiResponse.articles)
            
            // Emit from database for single source of truth
            emitAll(newsDao.getAllArticles().map { articles ->
                Resource.Success(articles)
            })
        } catch (e: Exception) {
            emit(Resource.Error(e.localizedMessage ?: "Unknown error"))
            
            // Emit cached data if available
            val cachedNews = newsDao.getAllArticles().first()
            if (cachedNews.isNotEmpty()) {
                emit(Resource.Success(cachedNews))
            }
        }
    }
}`
  },
  {
    id: 2,
    title: "Jetpack Compose UI Component",
    language: "kotlin",
    code: `@Composable
fun AnimatedCounter(
    count: Int,
    modifier: Modifier = Modifier,
    style: TextStyle = MaterialTheme.typography.h4
) {
    // Animation specs
    val animationSpec = remember {
        spring<Int>(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        )
    }
    
    // Animated value
    val animatedCount = animateIntAsState(
        targetValue = count,
        animationSpec = animationSpec
    )
    
    // UI implementation
    Box(
        modifier = modifier
            .background(
                color = MaterialTheme.colors.primary.copy(alpha = 0.15f),
                shape = RoundedCornerShape(8.dp)
            )
            .padding(horizontal = 16.dp, vertical = 8.dp)
    ) {
        Text(
            text = "\${animatedCount.value}",
            style = style,
            color = MaterialTheme.colors.primary
        )
    }
}`
  }
];
