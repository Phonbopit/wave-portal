const { expect } = require('chai');
const { ethers } = require('hardhat');

let wavePortal;

describe('WavePortal', () => {
  beforeEach(async () => {
    const WavePortal = await ethers.getContractFactory('WavePortal');

    wavePortal = await WavePortal.deploy();
    await wavePortal.deployed();
  });

  it('should get total waves', async () => {
    const totalWaves = await wavePortal.getTotalWaves();
    expect(totalWaves).to.equal(0);

    const tx = await wavePortal.wave('new waves');
    await tx.wait();

    const updatedTotalWaves = await wavePortal.getTotalWaves();
    expect(updatedTotalWaves).to.equal(1);
  });
  it('should listing all waves after waved!', async () => {
    const waves = await wavePortal.getAllWaves();
    expect(waves).to.be.an('array').that.is.empty;
    // expect(waves).to.deep.equal([]);

    const tx = await wavePortal.wave('Hello World');
    await tx.wait();

    const newWaves = await wavePortal.getAllWaves();
    expect(newWaves).to.be.an('array').that.is.not.empty;
    expect(newWaves.length).to.equal(1);
  });
});
