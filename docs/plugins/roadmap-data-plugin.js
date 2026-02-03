/**
 * Roadmap Data Plugin for Docusaurus
 * 
 * Parses all ROAD item files and generates static/roadmap-data.json
 * This allows the dashboard to load data at runtime
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

module.exports = function roadmapDataPlugin(context, options) {
  return {
    name: 'roadmap-data-plugin',
    
    async loadContent() {
      const roadsDir = path.join(context.siteDir, 'roads');
      const staticDir = path.join(context.siteDir, 'static');
      
      // Ensure static directory exists
      if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
      }
      
      const roadmapData = {
        items: [],
        generatedAt: new Date().toISOString()
      };
      
      // Read all ROAD files
      if (fs.existsSync(roadsDir)) {
        const files = fs.readdirSync(roadsDir)
          .filter(f => f.match(/ROAD-\d+\.md$/));
        
        for (const file of files) {
          try {
            const filePath = path.join(roadsDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);
            
            if (data.id && data.id.startsWith('ROAD-')) {
              roadmapData.items.push({
                id: data.id,
                title: data.title || 'Untitled',
                status: data.status || 'proposed',
                phase: data.phase || 1,
                created: data.created,
                started: data.started,
                completed: data.completed,
                priority: data.priority,
                governance: data.governance || {
                  adrs: { validated: false },
                  bdd: { status: 'pending' },
                  nfrs: { 
                    applicable: ['NFR-PERF-001', 'NFR-SEC-001', 'NFR-A11Y-001'],
                    status: 'pending'
                  }
                },
                blocks: data.blocks || [],
                depends_on: data.depends_on || [],
                blocked_by: data.blocked_by || [],
                filePath: `roads/${file.replace('.md', '')}`
              });
            }
          } catch (err) {
            console.warn(`Error parsing ${file}:`, err.message);
          }
        }
        
        // Sort by ID number
        roadmapData.items.sort((a, b) => {
          const numA = parseInt(a.id.split('-')[1]);
          const numB = parseInt(b.id.split('-')[1]);
          return numA - numB;
        });
      }
      
      // Write to static directory
      const outputPath = path.join(staticDir, 'roadmap-data.json');
      fs.writeFileSync(outputPath, JSON.stringify(roadmapData, null, 2));
      
      console.log(`✅ Generated roadmap-data.json with ${roadmapData.items.length} ROAD items`);
      
      return roadmapData;
    },
    
    async contentLoaded({ content, actions }) {
      // Data is already written to static directory
    },
  };
};
