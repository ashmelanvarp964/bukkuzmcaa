# Bukkuz SMP Updates & Security Hardening

## Completed Tasks

1. **Winter Theme Locked as Default**
   - Defaulted `seasonMode` and `activeSeasonId` to `'winter'` (Winter Frost, snowy peaks, and glacial cyan highlights).
   - In `MinecraftHeroCanvas`, the Three.js instanced particle simulation runs falling crystalline snow with frosted terrain lighting.
   - Text highlights, gradients, confetti bursts, and hero atmospheric glows reflect the icy winter aesthetic.

2. **Official 3D Glowing Bukkuz SMP Logo Integration**
   - Incorporated the user's uploaded official 3D glowing ice-crystal logo (`/assets/aistudio/file_00000000aae08211b48a3aad0c5b4b07_f1b87ff8.png`).
   - Positioned prominently:
     - **Navbar**: As the brand mark with soft cyan glow and responsive title.
     - **Hero Section**: Large, centered glowing 3D showcase above the winter headline.
     - **Footer**: Official emblem in creator and server credentials.
     - **index.html**: Configured as the high-resolution browser favicon and OpenGraph/Twitter share card image.

3. **Status Monitor (30-Day Uptime Monitor) Removed**
   - Removed the 30-Day Uptime Monitor block from `ServerDashboard.tsx`.
   - Preserved the authentic 24-hour Recharts live player trend chart and verified server specifications.

4. **Port 8080 Reserved for Pterodactyl Wings**
   - Removed the port 8080 block middleware in `server.ts`.
   - Updated `nginx.conf.example` to note that port 8080 is reserved for the Pterodactyl Wings game daemon node communication.

5. **Port 4000 Server Configuration**
   - Server runs directly on port 4000 (`http://0.0.0.0:4000`), with an automated dual listener on port 3000 to keep the development preview environment functional.
