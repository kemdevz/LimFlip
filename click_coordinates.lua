-- Click Coordinates Display Script
-- Displays the coordinates of mouse clicks and camera position in a GUI

local Players = game:GetService("Players")
local UserInputService = game:GetService("UserInputService")
local mouse = Players.LocalPlayer:GetMouse()
local RunService = game:GetService("RunService")

local player = Players.LocalPlayer
local playerGui = player:WaitForChild("PlayerGui")

-- Create ScreenGui
local screenGui = Instance.new("ScreenGui")
screenGui.Name = "ClickCoordinates"
screenGui.ResetOnSpawn = false
screenGui.Parent = playerGui

-- Create main frame
local frame = Instance.new("Frame")
frame.Name = "MainFrame"
frame.Size = UDim2.new(0, 300, 0, 140)
frame.Position = UDim2.new(0, 10, 0, 10)
frame.BackgroundColor3 = Color3.fromRGB(20, 20, 30)
frame.BackgroundTransparency = 0.3
frame.BorderSizePixel = 0
frame.Active = true
frame.Draggable = true
frame.Parent = screenGui

-- Create title label
local titleLabel = Instance.new("TextLabel")
titleLabel.Name = "Title"
titleLabel.Size = UDim2.new(1, 0, 0, 30)
titleLabel.Position = UDim2.new(0, 0, 0, 0)
titleLabel.BackgroundColor3 = Color3.fromRGB(30, 30, 45)
titleLabel.BackgroundTransparency = 0.5
titleLabel.BorderSizePixel = 0
titleLabel.Text = "Click Coordinates"
titleLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
titleLabel.TextSize = 16
titleLabel.Font = Enum.Font.GothamBold
titleLabel.Parent = frame

-- Create coordinates label
local coordsLabel = Instance.new("TextLabel")
coordsLabel.Name = "Coordinates"
coordsLabel.Size = UDim2.new(1, -20, 0, 45)
coordsLabel.Position = UDim2.new(0, 10, 0, 35)
coordsLabel.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
coordsLabel.BackgroundTransparency = 1
coordsLabel.BorderSizePixel = 0
coordsLabel.Text = "Click anywhere to see coordinates"
coordsLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
coordsLabel.TextSize = 14
coordsLabel.Font = Enum.Font.Gotham
coordsLabel.TextXAlignment = Enum.TextXAlignment.Left
coordsLabel.TextYAlignment = Enum.TextYAlignment.Top
coordsLabel.Parent = frame

-- Create camera position label
local cameraLabel = Instance.new("TextLabel")
cameraLabel.Name = "CameraPosition"
cameraLabel.Size = UDim2.new(1, -20, 0, 45)
cameraLabel.Position = UDim2.new(0, 10, 0, 80)
cameraLabel.BackgroundColor3 = Color3.fromRGB(0, 0, 0)
cameraLabel.BackgroundTransparency = 1
cameraLabel.BorderSizePixel = 0
cameraLabel.Text = "Camera: Loading..."
cameraLabel.TextColor3 = Color3.fromRGB(255, 255, 255)
cameraLabel.TextSize = 14
cameraLabel.Font = Enum.Font.Gotham
cameraLabel.TextXAlignment = Enum.TextXAlignment.Left
cameraLabel.TextYAlignment = Enum.TextYAlignment.Top
cameraLabel.Parent = frame

-- Update camera position every frame
RunService.RenderStepped:Connect(function()
    local camera = workspace.CurrentCamera
    local camPos = camera.CFrame.Position
    local camLook = camera.CFrame.LookVector
    cameraLabel.Text = string.format("Camera: X: %.2f, Y: %.2f, Z: %.2f\nLooking: X: %.2f, Y: %.2f, Z: %.2f",
        camPos.X, camPos.Y, camPos.Z, camLook.X, camLook.Y, camLook.Z)
end)

-- Handle mouse button clicks
mouse.Button1Down:Connect(function()
    local target = mouse.Hit
    local position = target.Position
    local coords = string.format("Click: X: %.2f, Y: %.2f, Z: %.2f", position.X, position.Y, position.Z)
    coordsLabel.Text = coords
    print("Click coordinates:", coords)
end)

print("Click Coordinates script loaded. Click anywhere to see coordinates.")
