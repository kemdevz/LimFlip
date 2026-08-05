local api = "https://api-bash.onrender.com/" -- Change this to your actual backend URL (e.g., https://your-domain.com/)
local Bot, You = game.Players.LocalPlayer, game.Players.LocalPlayer

local Players = game:GetService("Players")
local Trade = game:GetService("ReplicatedStorage"):WaitForChild("Trade")
local InventoryModule = require(game:GetService("ReplicatedStorage").Modules.InventoryModule)
local TextChatService = game:GetService("TextChatService")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local AcceptRequestRe = Trade:WaitForChild("AcceptRequest")
local AcceptTrade = Trade:WaitForChild("AcceptTrade")
local SendRequest = Trade:WaitForChild("SendRequest")
local DeclineTrade = Trade:WaitForChild("DeclineTrade")
local UpdateTrade = Trade:WaitForChild("UpdateTrade")
local HttpService = game:GetService("HttpService")
local Trading = false
local currentTrader
local currentTrade = {
    isDepositing   = false,
    isWithdrawing  = false,
}
local currentTraderRandomized

local currentDepo = {}
local currentWithdraw = {}

local API_KEY = "NIGGA"
local acceptTradeRemote = game.ReplicatedStorage:FindFirstChild("AcceptTrade", true)
local MM2ItemLimits = {
	Types = {
		Pets = 200
	},
	Rarities = {
		Common = 165,
		Uncommon = 240,
		Rare = 200,
		Christmas = 145,
		Godly = 165,
		Legendary = 165,
		Classic = 165,
		Ancient = 165,
		Halloween = 165,
		Unique = 95
	},
	Items = {
		Weapons = {
			Gindermint_G = 95,
			Gindermint_K = 95,
			ZombieBat = 95,
			Makeshift = 95,
			Candleflame = 95,
			SilverHarverster = 95,
			BronzeHarverster = 95,
			GoldHarverster = 95,
			BlueHarverster = 95,
			SwirlyAxeGold = 95,
			SwirlyAxeBronze = 95,
			SwirlyAxeBlue = 95,
			SwirlyAxeSilver = 95,
			SwirlyGunBronze = 95,
			SwirlyGunGold = 95,
			SwirlyBlade = 95,
			SwirlyAxe = 95,
			SwirlyGunBlue = 95,
			SwirlyGunSilver = 95,
			SwirlyGun = 95,
			ElderwoodKnife = 95,
			Icepiercer = 95,
			Icewing = 150,
			ElderwoodKnifeChroma = 45,
			Gindermint_KChroma = 45,
			SwirlyGunChroma = 45,
			Sorry = 18
		},
		Pets = {}
	}
}
game:GetService("RunService"):Set3dRenderingEnabled(false)

Bot.PlayerGui.TradeGUI.ResetOnSpawn = false

task.wait(1)

game:GetService("Lighting").GlobalShadows = false
for i, v in pairs(getconnections(game.Players.LocalPlayer.Idled)) do
    v:Disable()
end

local ohTable1 = {
    ["1v1Mode"] = false,
    ["Disguises"] = false,
    ["1v1ModeAuto"] = false,
    ["DeadCanTalk"] = false,
    ["LobbyMode"] = true,
    ["RoundTimer"] = 180,
    ["LockFirstPerson"] = false,
    ["Assassin"] = false
}

local remote = game:GetService("ReplicatedStorage").Remotes.CustomGames:FindFirstChild("UpdateServerSettings")

if remote then
    print("Remote found. Firing server with settings:", ohTable1)
    remote:FireServer(ohTable1)
else
    warn("Remote 'UpdateServerSettings' not found")
end

local ReceivingRequest = You.PlayerGui:WaitForChild("MainGUI").Game.Leaderboard.Container.TradeRequest.ReceivingRequest

-- Functions
local function pingBotStatus()
    local url = api .. "mm2/ping-bot"

    while wait(30) do -- ✅ Runs every 30 seconds
        pcall(function()
            if not Bot or not Bot.UserId then
                warn("❌ Failed to ping: Invalid bot ID.")
                return
            end

            local jsonBody = game:GetService("HttpService"):JSONEncode({
                botId = tostring(Bot.UserId)
            })

            local response = request({
                Url = url,
                Method = "POST",
                Headers = {
                    ["Content-Type"] = "application/json"
                },
                Body = jsonBody
            })

        end)
    end
end
spawn(pingBotStatus)

function typeChat(str)
    str = tostring(str)
    if TextChatService.ChatVersion == Enum.ChatVersion.TextChatService then
        TextChatService.TextChannels.RBXGeneral:SendAsync(str)
    else
        ReplicatedStorage.DefaultChatSystemChatEvents.SayMessageRequest:FireServer(str, "All")
    end
end

local function checkEligible(Player)
    local traderId = tostring(currentTrader)
    local jsonBody = HttpService:JSONEncode({
        Data = {
            UserId = game.Players:GetUserIdFromNameAsync(traderId)
        }
    })
    local url = api .. "mm2/withdraw/get-session"

    local success, res = pcall(function()
        return request({
            Url = url,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = jsonBody
        })
    end)

    if success and res.StatusCode == 200 then
        local data = HttpService:JSONDecode(res.Body)
        print("checkEligible data:", res.Body)
        if data["Exists"] == true then
            return true
        end
    else
        print("Failed to check eligibility:", res)
    end

    return false
end

local function checkPendingWithdrawals(Player)
    local traderId = tostring(currentTrader)
    local userId = game.Players:GetUserIdFromNameAsync(traderId)
    local url = api .. "mm2/withdraw/pending/" .. userId

    local success, res = pcall(function()
        return request({
            Url = url,
            Method = "GET",
            Headers = {
                ["Content-Type"] = "application/json"
            }
        })
    end)

    if success and res.StatusCode == 200 then
        local data = HttpService:JSONDecode(res.Body)
        print("checkPendingWithdrawals data:", res.Body)
        if data["withdrawals"] and #data["withdrawals"] > 0 then
            return data["withdrawals"]
        end
    else
        print("Failed to check pending withdrawals:", res)
    end

    return nil
end

local function checkItems(Player)
    local traderId = tostring(currentTrader)
    local jsonBody = HttpService:JSONEncode({
        Data = {
            UserId = game.Players:GetUserIdFromNameAsync(traderId)
        }
    })
    local url = api .. "mm2/withdraw/get-session"

    local success, res = pcall(function()
        return request({
            Url = url,
            Method = "POST",
            Headers = {
                ["Content-Type"] = "application/json"
            },
            Body = jsonBody
        })
    end)

    if success and res.StatusCode == 200 then
        local data = HttpService:JSONDecode(res.Body)
        print("checkItems data:", res.Body)
        return data["Items"] -- Return the Items directly
    else
        print("Failed to check items:", res)
    end

    return nil
end

local function addItems(items)
    for _, item in ipairs(items) do
        if item.inGameUID then
            local args = {
                [1] = item.inGameUID, -- use the inGameUID for the server call
                [2] = "Weapons"
            }
            game:GetService("ReplicatedStorage"):WaitForChild("Trade"):WaitForChild("OfferItem")
                :FireServer(unpack(args))

            table.insert(currentWithdraw, item._id) -- track the inGameUID
            wait()
        end
    end
end

local function check(datas)
    if datas.Player1.Player == game.Players.LocalPlayer then
        return "Player1", "Player2"
    end
    if datas.Player2.Player ~= game.Players.LocalPlayer then
        return
    end
    return "Player2", "Player1"
end
local function printTable(tbl, indent)
    indent = indent or 0
    local prefix = string.rep("  ", indent) -- Creates indentation for readability

    for key, value in pairs(tbl) do
        if type(value) == "table" then
            print(prefix .. tostring(key) .. " : {")
            printTable(value, indent + 1) -- Recursively print nested tables
            print(prefix .. "}")
        else
            print(prefix .. tostring(key) .. " : " .. tostring(value))
        end
    end
end
-- New function: Checks if the bot's inventory contains the item with the given inGameUID.
local function botHasItem(itemUID)
    for _, weaponGroup in pairs(InventoryModule.MyInventory.Data.Weapons) do
        for key, item in pairs(weaponGroup) do
            if type(item) == "table" and item.DataID == itemUID then
                return true
            end
        end
    end
    return false
end

-- In lua you start with the first index so 5 is actually 4 
local MAX_ITEMS_PER_TRADE = 5

local function verifyWithdrawalItems(items)
    local verifiedItems = {}
    local missingItems = {}

    for i, item in ipairs(items) do

        if i >= MAX_ITEMS_PER_TRADE then
            return verifiedItems
        end

        if botHasItem(item.inGameUID) then
            table.insert(verifiedItems, item)
        else
            table.insert(missingItems, item)
            typeChat("Item " .. item.inGameUID .. " is missing from inventory.")
        end
    end

    if #missingItems > 0 then
        typeChat("Some items are missing. Initiating trade with another bot to complete withdrawal.")

    end

    return verifiedItems
end

local function getIteminformation(Name)
    -- Debugging: Print entire inventory module if needed

    --[[     print("=== DEBUG: Printing Inventory Module Data ===")
    printTable(InventoryModule.MyInventory.Data.Weapons)
    print("=== DEBUG: End of Inventory Module Data ===") ]]

    for _, v in pairs(InventoryModule.MyInventory.Data.Weapons) do
        if v[Name] and v[Name].ItemName then
            local itemName = v[Name].ItemName
            local itemType = v[Name].ItemType or "Unknown"
            local rarity = v[Name].Rarity or "Unknown"

            if string.find(Name, "Chroma") then
                itemName = "Chroma" .. itemName
            end

            itemName = itemName:gsub("%s", "")

            local itemData = {
                ItemName = itemName,
                ItemType = itemType,
                Rarity = rarity,
                inGameUID = v[Name].DataID
            }

            print("Extracted Item Data:", itemData.ItemName, itemData.ItemType, itemData.Rarity)

            return itemData
        end
    end

    return {
        ItemName = Name:gsub("%s", ""),
        ItemType = "Unknown",
        Rarity = "Unknown"
    }
end

local function getItemAssetId(Name)
    for _, v in pairs(InventoryModule.MyInventory.Data.Weapons) do
        if v[Name] and v[Name].ItemName then
            print(string.match(v[Name].Image, '%d+$'))
            return "rbxassetid://" .. string.match(v[Name].Image, '%d+$')
        end
    end
end

local function resetState(clearTables)
    clearTables = clearTables or true
    currentTrader = nil
    currentTrade =  {
    isDepositing   = false,
    isWithdrawing  = false,
}
    currentTraderRandomized = nil
    Trading = false
    if clearTables then
        table.clear(currentDepo)
        table.clear(currentWithdraw)
    end
    ReceivingRequest.Visible = false
end

local function logWithdraw(PlayerName)
    local jsonBody = HttpService:JSONEncode({
        Data = {
            UserId = PlayerName,
            robloxId = game.Players:GetUserIdFromNameAsync(PlayerName),
            SecurityKey = API_KEY
        },
        key = API_KEY
    })

    local success = request({
        Url = api .. "mm2/withdraw/confirm-session",
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = jsonBody
    })

    if success then
        print("Withdrawal logged successfully")
    else
        print("Failed to log withdrawal")
    end
end

local function logDeposit(PlayerName)
    local logTable = {}
    for _, v in ipairs(currentDepo) do
        table.insert(logTable, v[1])
    end
    local InventoryString = table.concat(logTable, ", ")

    local jsonBody = HttpService:JSONEncode({
        Data = {
            UserId = PlayerName,
            Items = currentDepo
        },
        SecurityKey = API_KEY
    })

    local success = request({
        Url = api .. "mm2/deposit",
        Method = "POST",
        Headers = {
            ["Content-Type"] = "application/json"
        },
        Body = jsonBody
    })

    if success then
        print("Deposit logged successfully")
    else
        print("Failed to log deposit")
    end
end
local tradeCooldowns = {}
Trade.SendRequest.OnClientInvoke = function(player)
    local now = tick() -- current time in seconds

    if tradeCooldowns[player.UserId] and (now - tradeCooldowns[player.UserId] < 7) then
        local secondsLeft = 10 - (now - tradeCooldowns[player.UserId])
        secondsLeft = math.floor(secondsLeft * 10) / 10 -- Round to one decimal place
        typeChat("Please wait " .. secondsLeft .. "s.")
        return false -- Prevent processing this trade request.
    end

    -- Update the last trade time for this user.
    tradeCooldowns[player.UserId] = now
    print("Trade request received from " .. player.Name)
    if not Trading then
        resetState()
        Trading = true
        currentTrader = player.Name
        currentTraderRandomized = currentTrader .. tostring(math.random(1, 1000))
        print("Trading with " .. currentTrader)

        task.wait(0.5)
        game:GetService("ReplicatedStorage"):WaitForChild("Trade"):WaitForChild("AcceptRequest"):FireServer()

       task.spawn(function()
    local traderBefore = currentTraderRandomized
    -- pick a random timeout between 25.000 and 45.000 seconds (3-decimal precision)
    local timeoutMs = math.random(25000, 45000)
    local timeout   = timeoutMs / 1000
    local whole     = math.floor(timeout)
    local frac      = timeout - whole

    -- first, wait whole seconds in 1-second ticks
    for i = 1, whole do
        task.wait(1)
        -- if trading stopped or trader changed, bail out early
        if not Trading or traderBefore ~= currentTraderRandomized then
            return
        end
    end

    -- then wait the fractional remainder
    if frac > 0 then
        task.wait(frac)
    end

    -- if still in the same trade after the full randomized delay, timeout
    if Trading and traderBefore == currentTraderRandomized then
        resetState()
        game:GetService("ReplicatedStorage")
            :WaitForChild("Trade")
            :WaitForChild("DeclineTrade")
            :FireServer()
        typeChat(("Time limit ran out"))
    end
end)


        if checkEligible(player) then -- Withdrawing
            typeChat("Player is withdrawing items")
            currentTrade.isWithdrawing = true
            task.wait(0.1)
            local Items = checkItems(player)
            if Items then
                local verifiedItems = verifyWithdrawalItems(Items)
                if #verifiedItems > 0 then
                    addItems(verifiedItems)
                else
                    typeChat("No valid items to withdraw.")
                end
            else
                print("No items to add")
            end
        else -- Depositing
            typeChat("Player is depositing items.")
            typeChat("Please do not deposit pets. They will not be credited.")
                currentTrade.isDepositing = true
        end

        -- Check for pending withdrawals
        local pendingWithdrawals = checkPendingWithdrawals(player)
        if pendingWithdrawals then
            typeChat("You have pending withdrawals. Join the server to complete them.")
        end
    else
        print("Declined because already trading")
        game:GetService("ReplicatedStorage"):WaitForChild("Trade"):WaitForChild("DeclineRequest"):FireServer()
    end

    return true
end

UpdateTrade.OnClientEvent:Connect(function(data)
    if Trading then
        table.clear(currentDepo)

        local you, them = check(data)
        local yourOffer = data[you].Offer
        local theirOffer = data[them].Offer
        currentTrade.isDepositing = (#theirOffer > 0)
        for i, item in pairs(theirOffer) do
            local newTable = {item[1], item[2]}
            table.insert(currentDepo, newTable)
        end
    end
end)

--[[ DeclineTrade.OnClientEvent:Connect(function()
    resetState(false)
    typeChat("Trade ended")
end) ]]

acceptTradeRemote.OnClientEvent:Connect(function(complete, items_)
    if acceptTradeRemote.Name == "AcceptTrade" and complete then

        if complete then
            print("Trade Completed,")
            -- print("Current Trader: " .. currentTrader)

            local traderId = currentTrader

            if not items_ then
                items_ = {}
            end
            print("currentTrade")
            if currentTrade.isDepositing == true then
                if (#items_ > 0) then
                    local BodyTable = {}
                    BodyTable["key"] = API_KEY
                    BodyTable["Data"] = {
                        UserId = game.Players:GetUserIdFromNameAsync(traderId),
                        items = {}
                    }
                    BodyTable["SecurityKey"] = API_KEY

                    for i, v in pairs(currentDepo) do
                        local Iteminformation = getIteminformation(v[1])
                        table.insert(BodyTable["Data"]["items"], {
                            ["name"] = Iteminformation.ItemName,
                            ["gameName"] = v[1],
                            ["itemType"] = Iteminformation.ItemType,
                            ["rarity"] = Iteminformation.Rarity,
                            ["inGameUID"] = Iteminformation.inGameUID,
                            ["quantity"] = v[2],
                            ["assetId"] = getItemAssetId(v[1])
                        })
                    end

                    local jsonBody = HttpService:JSONEncode(BodyTable)
                    local res = request({
                        Url = api .. "mm2/deposit",
                        Method = "POST",
                        Headers = {
                            ["Content-Type"] = "application/json"
                        },
                        Body = jsonBody
                    })
                    print(res.Body)
                end
            end

            if currentTrade.isWithdrawing == true then
                local url = api .. "mm2/withdraw/confirm-session"
                -- local url = "https://withdraw-crypto.requestcatcher.com/"
                local BodyTable = {}
                BodyTable["Data"] = {
                    currentWithdraw = currentWithdraw,
                    UserId = game.Players:GetUserIdFromNameAsync(traderId)
                }
                BodyTable["SecurityKey"] = API_KEY

                local jsonBody = HttpService:JSONEncode(BodyTable)
                print("JSON Body: ", jsonBody)

                local res = request({
                    Url = url,
                    Method = "POST",
                    Headers = {
                        ["Content-Type"] = "application/json"
                    },
                    Body = jsonBody
                })
            end

            typeChat("Trade Completed.")

            task.wait(1)

            resetState()
        end
    elseif Trading and currentTrader and currentTrader ~= "" then
        AcceptTrade:FireServer(285646582)

        print("accepted trade as the second player.")
    else
        typeChat("An Unkown Error Occured While Processing Your Trade, please contact support.")
        DeclineTrade:FireServer()
        resetState()
    end
end)

