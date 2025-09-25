#!/usr/bin/env node

/**
 * Test script to verify health checks work correctly
 * Run this after starting both bot and client services locally
 */

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const BOT_URL = process.env.BOT_URL || 'http://localhost:3001'

async function testHealthCheck(url, name) {
  try {
    console.log(`\n🔍 Testing ${name}...`)
    const startTime = Date.now()
    const response = await fetch(url)
    const responseTime = Date.now() - startTime
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ ${name} is healthy`)
      console.log(`   Response time: ${responseTime}ms`)
      console.log(`   Status: ${data.ok ? 'OK' : 'DEGRADED'}`)
      
      if (data.services) {
        console.log(`   Services:`)
        Object.entries(data.services).forEach(([service, status]) => {
          console.log(`     - ${service}: ${status.status}`)
        })
      }
      
      return true
    } else {
      console.log(`❌ ${name} returned ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ ${name} failed: ${error.message}`)
    return false
  }
}

async function testStatusPage() {
  try {
    console.log(`\n🔍 Testing Status Page...`)
    const response = await fetch(`${BASE_URL}/api/status`)
    
    if (response.ok) {
      const data = await response.json()
      console.log(`✅ Status page is working`)
      console.log(`   Overall status: ${data.overallStatus}`)
      console.log(`   Services:`)
      data.services.forEach(service => {
        console.log(`     - ${service.name}: ${service.status} (${service.responseTime}ms)`)
      })
      return true
    } else {
      console.log(`❌ Status page returned ${response.status}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Status page failed: ${error.message}`)
    return false
  }
}

async function main() {
  console.log('🚀 Testing TicketMesh Health Checks')
  console.log('=====================================')
  
  const results = []
  
  // Test individual health endpoints
  results.push(await testHealthCheck(`${BASE_URL}/api/health`, 'Client API Health'))
  results.push(await testHealthCheck(`${BASE_URL}/api/health/database`, 'Database Health'))
  results.push(await testHealthCheck(`${BOT_URL}/health`, 'Bot Health'))
  
  // Test status page
  results.push(await testStatusPage())
  
  // Summary
  const passed = results.filter(Boolean).length
  const total = results.length
  
  console.log('\n📊 Test Results')
  console.log('================')
  console.log(`Passed: ${passed}/${total}`)
  
  if (passed === total) {
    console.log('🎉 All health checks passed!')
    process.exit(0)
  } else {
    console.log('⚠️  Some health checks failed')
    process.exit(1)
  }
}

main().catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})

