const https = require('https');

const getResponseBody = (url, headers = {}) => new Promise((resolve, reject) => {
  const request = https.get(url, { headers }, (response) => {
    if (response.statusCode < 200 || response.statusCode >= 300) {
      response.resume();
      reject(new Error(`Roblox request failed with status ${response.statusCode}`));
      return;
    }

    let body = '';
    response.setEncoding('utf8');
    response.on('data', (chunk) => {
      body += chunk;
      if (body.length > 5 * 1024 * 1024) {
        request.destroy(new Error('Roblox response exceeded the size limit'));
      }
    });
    response.on('end', () => resolve(body));
  });

  request.setTimeout(10000, () => request.destroy(new Error('Roblox request timed out')));
  request.on('error', reject);
});

const decodeHtmlEntities = (value) => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>')
  .replace(/&amp;/gi, '&');

const getPublicProfileDescription = async (userId) => {
  if (!/^\d+$/.test(String(userId))) {
    throw new Error('Invalid Roblox user ID');
  }

  const profileUrl = `https://www.roblox.com/users/${userId}/profile`;
  const html = await getResponseBody(profileUrl, {
    Accept: 'text/html',
    'Cache-Control': 'no-cache',
    'User-Agent': 'Bloxbashh/1.0'
  });
  const descriptionMeta = html.match(
    /<meta\s+(?:name|property)=["'](?:description|og:description)["']\s+content=["']([\s\S]*?)["']\s*\/?>/i
  );

  return descriptionMeta ? decodeHtmlEntities(descriptionMeta[1]).trim() : '';
};

const mockRobloxUsers = [
  { username: 'RobloxDev', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '1' },
  { username: 'Builderman', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '2' },
  { username: 'NoobMaster', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '3' },
  { username: 'ProGamer123', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '4' },
  { username: 'CoolKid99', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '5' },
  { username: 'SpeedRunner', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '6' },
  { username: 'GameMaster', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '7' },
  { username: 'BlockBuilder', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '8' },
  { username: 'AdventureSeeker', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '9' },
  { username: 'PixelArtist', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '10' },
  { username: 'AmazingPlayer', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '11' },
  { username: 'AwesomeGamer', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '12' },
  { username: 'CoolBuilder', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '13' },
  { username: 'SuperDev', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '14' },
  { username: 'MegaPlayer', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '15' },
  { username: 'Radotron_0', avatar: 'https://tr.rbxcdn.com/38c6edcb506ec7e0e3a6b2f8c7b3e5c0/420/420/Hat/Png', id: '123456789' },
];

const searchRobloxUsers = async (query) => {
  if (!query || query.length < 3) {
    return [];
  }

  try {
    const robloxApiUrl = `https://users.roblox.com/v1/users/search?keyword=${encodeURIComponent(query)}&limit=10`;

    return new Promise((resolve, reject) => {
      https.get(robloxApiUrl, (robloxRes) => {
        let data = '';

        robloxRes.on('data', (chunk) => {
          data += chunk;
        });

        robloxRes.on('end', () => {
          try {
            const robloxData = JSON.parse(data);
            
            if (robloxData.errors && robloxData.errors.length > 0) {
              console.log('Roblox API returned errors:', JSON.stringify(robloxData.errors));
              // Fallback to mock users if API fails
              const filteredMock = mockRobloxUsers.filter(user => 
                user.username.toLowerCase().includes(query.toLowerCase())
              );
              resolve(filteredMock.length > 0 ? filteredMock : []);
              return;
            }
            
            const userIds = robloxData.data?.map(user => user.id) || [];
            
            if (userIds.length === 0) {
              resolve([]);
              return;
            }

            const thumbnailUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userIds.join(',')}&size=420x420&format=Png&isCircular=false`;
            
            https.get(thumbnailUrl, (thumbRes) => {
              let thumbData = '';
              
              thumbRes.on('data', (chunk) => {
                thumbData += chunk;
              });
              
              thumbRes.on('end', () => {
                try {
                  const thumbJson = JSON.parse(thumbData);
                  
                  const thumbnailMap = {};
                  thumbJson.data?.forEach(thumb => {
                    thumbnailMap[thumb.targetId] = thumb.imageUrl;
                  });
                  
                  const results = robloxData.data?.map(user => ({
                    username: user.name,
                    avatar: thumbnailMap[user.id] || `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`,
                    id: user.id
                  })) || [];

                  resolve(results);
                } catch (thumbError) {
                  console.error('Error parsing thumbnail response:', thumbError);
                  const results = robloxData.data?.map(user => ({
                    username: user.name,
                    avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`,
                    id: user.id
                  })) || [];
                  resolve(results);
                }
              });
            }).on('error', (thumbErr) => {
              console.error('Error fetching thumbnails:', thumbErr);
              const results = robloxData.data?.map(user => ({
                username: user.name,
                avatar: `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=420&height=420&format=png`,
                id: user.id
              })) || [];
              resolve(results);
            });

          } catch (parseError) {
            console.error('Error parsing Roblox API response:', parseError);
            resolve([]);
          }
        });
      }).on('error', (err) => {
        console.error('Error calling Roblox API:', err);
        resolve([]);
      });
    });
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};

const checkUsernameExists = async (username) => {
  try {
    const robloxApiUrl = 'https://users.roblox.com/v1/usernames/users';
    const postData = JSON.stringify({
      usernames: [username],
      excludeBannedUsers: false
    });

    return new Promise((resolve, reject) => {
      const robloxReq = https.request(robloxApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (robloxRes) => {
        let data = '';

        robloxRes.on('data', (chunk) => {
          data += chunk;
        });

        robloxRes.on('end', () => {
          try {
            const robloxData = JSON.parse(data);
            
            if (robloxData.data && robloxData.data.length > 0) {
              const foundUser = robloxData.data.find(u => u.name.toLowerCase() === username.toLowerCase());
              if (foundUser) {
                resolve({ exists: true, userId: foundUser.id });
              } else {
                resolve({ exists: false });
              }
            } else {
              resolve({ exists: false });
            }
          } catch (parseError) {
            console.error('Error parsing Roblox API response:', parseError);
            // Fallback to mock users
            const mockUser = mockRobloxUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
            if (mockUser) {
              resolve({ exists: true, userId: mockUser.id });
            } else {
              reject(new Error('Error checking username'));
            }
          }
        });
      }).on('error', (err) => {
        console.error('Error calling Roblox API:', err);
        // Fallback to mock users
        const mockUser = mockRobloxUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
        if (mockUser) {
          resolve({ exists: true, userId: mockUser.id });
        } else {
          reject(new Error('Error checking username'));
        }
      });

      robloxReq.write(postData);
      robloxReq.end();
    });
  } catch (error) {
    console.error('Check username error:', error);
    // Fallback to mock users
    const mockUser = mockRobloxUsers.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (mockUser) {
      return { exists: true, userId: mockUser.id };
    }
    throw new Error('Internal server error');
  }
};

const getUserDescription = async (userId) => {
  try {
    const robloxApiUrl = `https://users.roblox.com/v1/users/${userId}`;
    const body = await getResponseBody(robloxApiUrl, {
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
      'User-Agent': 'Bloxbashh/1.0'
    });
    const robloxData = JSON.parse(body);

    if (robloxData.description) {
      return { description: robloxData.description, source: 'users-api' };
    }
  } catch (error) {
    console.warn('Roblox users API description lookup failed; trying public profile:', error.message);
  }

  try {
    const description = await getPublicProfileDescription(userId);
    return { description, source: 'public-profile' };
  } catch (error) {
    console.error('Public Roblox profile description lookup failed:', error.message);
    throw new Error('Unable to fetch the Roblox profile description');
  }
};

module.exports = {
  searchRobloxUsers,
  checkUsernameExists,
  getUserDescription,
  getPublicProfileDescription,
  mockRobloxUsers
};
