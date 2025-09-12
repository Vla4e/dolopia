import { allProductMap } from "@/assets/products/allProductMap";

const Priority = Object.freeze({
  COMPLETE: 1,
  VERY_HIGH: 2,
  HIGH: 3,
  NORMAL: 4,
  LOW: 5,
  VERY_LOW: 6
});

const maxResults = 60;

// words to ignore during indexing
const STOP_WORDS = new Set(['with', 'and', 'or', 'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'by']);

class TrieNode {
  constructor() {
    this.children = {};
    this.products = new Map(); // Key: productId, Value: { priority, matchType }
  }
}

class ProductSearchTrie {
  constructor() {
    this.root = new TrieNode();
  }

  normalize(text) {
    return text.toLowerCase()
      .replace(/&/g, 'and')
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  // Insert full text for prefix matching
  insertForPrefixMatching(productId, text, priority) {
    const normalizedText = this.normalize(text);
    if (!normalizedText) return;

    let node = this.root;
    for (const char of normalizedText) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      
      // Store product at every node for prefix matching
      const existingProduct = node.products.get(productId);
      if (!existingProduct || priority < existingProduct.priority) {
        node.products.set(productId, { priority, matchType: 'prefix' });
      }
    }
    
    // Mark complete match at the final node
    const existingProduct = node.products.get(productId);
    if (!existingProduct || priority < existingProduct.priority) {
      node.products.set(productId, { priority, matchType: 'complete' });
    }
  }

  insertWordsForMatching(productId, text, priority) {
    const normalizedText = this.normalize(text);
    const words = normalizedText.split(' ')
      .filter(word => word.length > 0 && !STOP_WORDS.has(word));

    words.forEach(word => {
      // Index each word for prefix matching
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
        
        // Store product at every node for prefix matching within words
        const existingProduct = node.products.get(productId);
        if (!existingProduct || priority < existingProduct.priority) {
          node.products.set(productId, { priority, matchType: 'prefix' });
        }
      }
    });
  }

  // insert words for exact matching
  insertForExactMatching(productId, text, priority) {
    const normalizedText = this.normalize(text);
    const words = normalizedText.split(' ')
      .filter(word => word.length > 0 && !STOP_WORDS.has(word));

    words.forEach(word => {
      let node = this.root;
      for (const char of word) {
        if (!node.children[char]) {
          node.children[char] = new TrieNode();
        }
        node = node.children[char];
      }
      
      // only store at final node if exact match
      const existingProduct = node.products.get(productId);
      if (!existingProduct || priority < existingProduct.priority) {
        node.products.set(productId, { priority, matchType: 'complete' });
      }
    });
  }

  findMatches(query) {
    const normalizedQuery = this.normalize(query);
    if (!normalizedQuery) return [];

    let node = this.root;
    for (const char of normalizedQuery) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    console.log("node ->", node)
    return this.collectAllProducts(node);
  }

  collectAllProducts(startNode) {
    const results = new Map(); // Prevent duplicates

    const findProducts = (currentNode, isExactMatch = false) => {
      currentNode.products.forEach(({ priority, matchType }, productId) => {
        // Determine if complete match
        const isComplete = (currentNode === startNode && matchType === 'complete') || isExactMatch;
        const finalMatchType = isComplete ? 'complete' : 'prefix';
        const score = this.calculateScore(priority, finalMatchType);
        
        // Only add if new result better than existing result for product
        const existing = results.get(productId);
        if (!existing || score > existing.score) {
          results.set(productId, { 
            productId, 
            score, 
            priority, 
            matchType: finalMatchType 
          });
        }
      });

      // Only traverse children if looking for prefix matches
      Object.values(currentNode.children).forEach(childNode => {
        findProducts(childNode, false);
      });
    };

    findProducts(startNode, startNode === this.root);
    return Array.from(results.values())
      .sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority;
        }
        
        //Sort by product ID for consistency
        return a.productId.localeCompare(b.productId);
      })
      .slice(0, maxResults);
  }

  calculateScore(priority, matchType) {
    let score = 0;
    
    switch (priority) {
      case Priority.COMPLETE: score += 2000; break;
      case Priority.VERY_HIGH: score += 1000; break;
      case Priority.HIGH: score += 500; break;
      case Priority.NORMAL: score += 100; break;
      case Priority.LOW: score += 50; break;
      case Priority.VERY_LOW: score += 10; break;
    }
    
    // match type bonus score
    if (matchType === 'complete') {
      score += 50;
    } else if (matchType === 'prefix') {
      score += 25;
    }

    return score;
  }

  indexProducts(productMap) {
    console.log('Indexing products...')
    
    productMap.forEach((product, productId) => {
      if (product['Product name EN']) {
        // this.insertForPrefixMatching(productId, product['Product name EN'], Priority.NORMAL);
        this.insertWordsForMatching(productId, product['Product name EN'], Priority.NORMAL);
      }
      
      if (product['keyToSubcategory']) {
        this.insertForPrefixMatching(productId, product['keyToSubcategory'], Priority.HIGH);
      }

      if (product['keyToCategory']) {
        this.insertForPrefixMatching(productId, product['keyToCategory'], Priority.VERY_HIGH);
      }

      if (product['Tags Eng']) {
        this.insertForExactMatching(productId, product['Tags Eng'], Priority.LOW);
      }
    });

    console.log(`Indexed ${productMap.size} products`);
  }
}

//create singleton, export it
const productSearchTrie = new ProductSearchTrie();
productSearchTrie.indexProducts(allProductMap);

export { ProductSearchTrie, productSearchTrie, Priority };