#!/usr/bin/env node

/**
 * Test script to verify API fixes
 * This script tests the health endpoints to ensure they're working correctly
 */

const https = require('https');
const http = require('http');

// Configuration
const CLIENT_URL = 'https://ticketmesh.win';
const BOT_URL = process.env.BOT_URL || 'http://localhost:3001'; // Will be set by Railway

/**
 * Make HTTP request with timeout
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const requestOptions = {
      timeout: 10000,
      headers: {
        'User-Agent': 'TicketMesh-Test/1.0'
      },
      ...options
    };

    const req = client.request(url, requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: jsonData
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            data: data
          });
        }
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

/**
 * Test a health endpoint
 */
async function testHealthEndpoint(url, name) {
  console.log(`\n🔍 Testing ${name}...`);
  console.log(`   URL: ${url}`);
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(url);
    const responseTime = Date.now() - startTime;
    
    console.log(`   Status: ${response.status}`);
    console.log(`   Response Time: ${responseTime}ms`);
    
    if (response.status === 200) {
      console.log(`   ✅ ${name} is healthy`);
      if (response.data && typeof response.data === 'object') {
        console.log(`   Data:`, JSON.stringify(response.data, null, 2));
      }
    } else {
      console.log(`   ❌ ${name} returned ${response.status}`);
      if (response.data && response.data.error) {
        console.log(`   Error: ${response.data.error}`);
      }
    }
    
    return {
      name,
      url,
      status: response.status,
      responseTime,
      healthy: response.status === 200,
      data: response.data
    };
  } catch (error) {
    console.log(`   ❌ ${name} failed: ${error.message}`);
    return {
      name,
      url,
      status: 'ERROR',
      responseTime: 0,
      healthy: false,
      error: error.message
    };
  }
}

/**
 * Test all health endpoints
 */
async function testAllEndpoints() {
  console.log('🚀 Starting API Health Tests...\n');
  
  const tests = [
    {
      url: `${CLIENT_URL}/api/health`,
      name: 'Client Health'
    },
    {
      url: `${CLIENT_URL}/api/health/database`,
      name: 'Database Health'
    },
    {
      url: `${CLIENT_URL}/api/health/bot`,
      name: 'Bot Health'
    },
    {
      url: `${CLIENT_URL}/api/status`,
      name: 'Status Page'
    },
    {
      url: `${BOT_URL}/health`,
      name: 'Bot Service Health'
    }
  ];

  const results = [];
  
  for (const test of tests) {
    const result = await testHealthEndpoint(test.url, test.name);
    results.push(result);
  }
  
  // Summary
  console.log('\n📊 Test Summary:');
  console.log('================');
  
  const healthy = results.filter(r => r.healthy).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.healthy ? '✅' : '❌';
    const time = result.responseTime > 0 ? `${result.responseTime}ms` : 'N/A';
    console.log(`${status} ${result.name}: ${result.status} (${time})`);
  });
  
  console.log(`\nOverall: ${healthy}/${total} endpoints healthy`);
  
  if (healthy === total) {
    console.log('🎉 All endpoints are working correctly!');
    process.exit(0);
  } else {
    console.log('⚠️  Some endpoints need attention.');
    process.exit(1);
  }
}

// Run tests
if (require.main === module) {
  testAllEndpoints().catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = { testAllEndpoints, testHealthEndpoint };
