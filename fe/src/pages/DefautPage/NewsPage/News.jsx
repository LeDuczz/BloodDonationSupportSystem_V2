
import { Box, Container, Typography, Card, CardMedia,CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ManagementAPI } from "../../../api/ManagementAPI";
import { useEffect, useState } from "react";

export default function News() {
	const [articles, setArticles] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchArticles = async () => {
			const articles = await ManagementAPI.getAllArticles();
			
			setArticles(articles.data);
		};
		fetchArticles();
	}, []);

	const handleNewsClick = (news) => {
		navigate(`/news/${news.id}`, { 
			state: { newsData: news } 
		});
	};

	return (
		<Container maxWidth="xl" sx={{margin :"auto", marginTop: "80px"} }>
			{/* <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
				<Typography variant="h3">{message}</Typography>
			</Box> */}
			<Box  >
				<Box
							
					sx={{
						display : 'flex', flexWrap : 'wrap', justifyContent: "center",gap: 3,
						
					}}
				>
					{articles && articles.map((news) => (
						<Box
							item
							key={news.id}
							sx={{
								flex: "0 0 340px", 
								maxWidth: 340,
								minWidth: 340,
								display: "flex",
							}}
						>
							<Card
								sx={{
									marginBottom : 2,
									marginTop: 2,
									width: 1,
									height: 340, 
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									borderRadius: 3,
									boxShadow: 3,
									transition: "box-shadow 0.2s",
									"&:hover": { boxShadow: 8 },
									cursor: "pointer",
								}}
								onClick={() => handleNewsClick(news)}
							>
								<CardMedia
									component="img"
									image={`${import.meta.env.VITE_ARTICLE_BASE_URL}/${news.imageUrl}`}
									alt="News Thumbnail"
									sx={{
										width: "100%",
										height: 160,
										objectFit: "cover",
										borderTopLeftRadius: 12,
										borderTopRightRadius: 12,
									}}
								/>
								<CardContent sx={{ flex: 1, width: "100%", p: 2, display: "flex", flexDirection: "column", alignItems: "center" }}>
									<Typography
										variant="h6"
										component="h2"
										sx={{
											textAlign: "center",
											fontWeight: 700,
											fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.25rem" },
											mb: 1,
											display: "-webkit-box",
											WebkitLineClamp: 2,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
											minHeight: 56,
										}}
									>
										{news.title}
									</Typography>
									<Typography
										variant="body2"
										color="text.secondary"
										sx={{
											textAlign: "center",
											fontSize: { xs: "1.15rem", sm: "1.2rem", md: "1.25rem" },
											display: "-webkit-box",
											WebkitLineClamp: 3,
											WebkitBoxOrient: "vertical",
											overflow: "hidden",
											minHeight: 60,
										}}
									>
										{news.content}
									</Typography>
								</CardContent>
							</Card>
						</Box>
					))}
				</Box>
			</Box>
		</Container>
	);
}