    import { Button, Card,Container, CardContent, Stack, Typography, Box } from "@mui/material"
    import { Heart, ClipboardCheck } from "lucide-react"
    import { Outlet, useLocation, useNavigate } from "react-router-dom"

    export function Navigation() {

    const location = useLocation()
    const navigate = useNavigate()
    const pathname = location.pathname

    const navItems = [
        {
        path: "/staff/blood-management/health-check",
        label: "Sàng lọc sức khỏe",
        icon: Heart,
        description: "Kiểm tra và đánh giá tình trạng sức khỏe người hiến máu",
        },
        {
        path: "/staff/blood-management/process",
        label: "Quản lý tiến trình",
        icon: ClipboardCheck,
        description: "Theo dõi và quản lý toàn bộ quy trình hiến máu",
        },
    ]

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card sx={{ p: 2}}>
        <CardContent >
            <Stack spacing={2} direction="row" >
            {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.path

                return (
                <Button
                    key={item.path}
                    variant={isActive ? "contained" : "outlined"}
                    onClick={() => navigate(item.path)}
                    startIcon={<Icon size={24} />}
                    sx={{
                    width: 600,
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    textAlign: "left",
                    flexDirection: "column",
                    gap: 0.5,
                    px: 2,
                    py: 1.5,
                    }}
                >
                    <Typography variant="subtitle1" fontWeight={600}>
                    {item.label}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                    {item.description}
                    </Typography>
                </Button>
                )   
            })}
            </Stack>
            <Outlet/>
        </CardContent>
        </Card>
        </Container>
    )
    }
